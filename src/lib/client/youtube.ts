import { Db } from "../db";
import { AuthDetails, Channel, LoginDetails, PlaylistItem } from "../types/dtos";
import { HttpRequestHeaders, SubscriptionResponse, ChannelDetails, PlaylistItemListResponse } from "../types/http";
import { getLoginResponse, initializeLogin, refreshToken } from "./login";



export class YoutubeClient {
    private apiBaseUrl: string = process.env.REACT_APP_API_BASE_URL || "";
    authDetails: AuthDetails | undefined;
    private refreshTokenTaskHandle: number | undefined;
    private dbId = "YoutubeClient";
    private db: Db;
    isRefreshing: boolean = false;

    constructor({ db }: { db: Db }) {
        this.db = db;
        this.loadFromDb();
    }

    /**
     * Checks to confirm that it is logged in
     */
    isLoggedIn(): boolean {
        return !!this.authDetails?.expiresAt && (this.authDetails?.expiresAt > new Date());
    }

    /**
     * Loads its attributes from the database
     */
    private loadFromDb() {
        const { apiBaseUrl, authDetails, refreshTokenTaskHandle } = this.db.get(this.dbId) || {};
        this.apiBaseUrl = apiBaseUrl || process.env.REACT_APP_API_BASE_URL;

        if (authDetails?.expiresAt && new Date(authDetails.expiresAt) > new Date()) {
            authDetails.expiresAt = new Date(authDetails.expiresAt);
            this.authDetails = authDetails;
            this.refreshTokenTaskHandle = refreshTokenTaskHandle;
            this.startTokenRefresh();
        } else if (authDetails?.refreshToken) {
            this.refreshAuthDetails(authDetails)
                .then(() => { this.startTokenRefresh(); })
                .catch(console.error);
        }
        else if (refreshTokenTaskHandle) {
            window.clearTimeout(refreshTokenTaskHandle);
        }
    }

    /**
     * Refreshes stale auth details
     * @param authDetails - the stale auth details
     */
    async refreshAuthDetails(authDetails: AuthDetails) {
        this.isRefreshing = true;
        try {
            const data = await refreshToken(this.apiBaseUrl, { refresh_token: authDetails.refreshToken });
            this.authDetails = data;
            this.saveToDb();
        } catch (error) {
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }

    /**
     * Saves the client into the database
     */
    private saveToDb() {
        this.db.set(this.dbId, {
            authDetails: this.authDetails,
            apiBaseUrl: this.apiBaseUrl,
            refreshTokenTaskHandle: this.refreshTokenTaskHandle,
        });
    }

    /**
     * Handles any clean up when the client is no longer needed
     */
    destroy() {
        if (this.refreshTokenTaskHandle) {
            window.clearTimeout(this.refreshTokenTaskHandle);
        }
        this.saveToDb();
    }

    /**
     * Initializes login and returns the LoginDetails for the user to login with
     * on another device e.g. phone or desktop
     */
    async getLoginDetails(): Promise<LoginDetails> {
        return initializeLogin(this.apiBaseUrl);
    }

    /**
     * Updates the authDetails of this app with data got from checking the status of the login
     * @param loginDetails
     */
    async finalizeLogin(loginDetails: LoginDetails) {
        this.authDetails = await getLoginResponse(this.apiBaseUrl, {
            device_code: loginDetails.deviceCode,
            interval: loginDetails.interval
        });
        this.saveToDb();
        this.startTokenRefresh();
    }

    /**
     * Starts the Token refresh task
     */
    private startTokenRefresh() {
        const authDetails = this.authDetails;

        if (authDetails) {
            this.refreshTokenTaskHandle = window.setTimeout(async () => {
                await this.refreshAuthDetails(authDetails);
                this.startTokenRefresh();
            }, (authDetails.expiresIn - 300) * 1000);
        }
    }

    /**
     * Generates the headers for making the requests to the YouTube API endpoints
     * @throws Error("client is not yet authenticated.")
     */
    private getHeaders(): HttpRequestHeaders {
        if (!this.authDetails?.accessToken) {
            throw new Error("client is not yet authenticated.")
        }

        return {
            "X-YouHedge-Token": this.authDetails.accessToken,
            Accept: "application/json",
        };
    }

    /**
     * Gets all Channels corresponding to the given pageToken
     * @param pageToken - the token of the page to return from the API
     */
    async getChannels(pageToken?: string): Promise<Channel[]> {
        const subscriptionsResp = await this.getSubscriptions(pageToken);
        const promises = subscriptionsResp.items.map(
            (item) => this.getChannelDetails(item.snippet.resourceId.channelId));
        const channelDetailsList = await Promise.all(promises);
        return channelDetailsList.map(
            (channelDetails, index) => new Channel(subscriptionsResp, channelDetails, index))
    }

    /**
     * Gets the playlist items that belong to the channel of the given id and
     * @param channel - the Channel whose playlist items are to be returned
     * @param pageToken - the pageToken of the page to return
     */
    async getPlaylistItems(channel: Channel, pageToken?: string): Promise<PlaylistItem[]> {
        const { playlistId, id: channelId } = channel;
        const playlistItemsResp = await this.getPlaylistItemList(playlistId, pageToken);
        return playlistItemsResp.items.map(
            (item) => new PlaylistItem(playlistItemsResp, item, channelId))
    }


    /**
     * Gets the subscriptions of the logged in user i.e. the owner fo the access token
     * https://documenter.getpostman.com/view/17998957/UzXPwGN8#9faa23c1-1255-4267-ad39-ade2121911b3
     *
     * @param pageToken
     */
    private async getSubscriptions(pageToken?: string): Promise<SubscriptionResponse> {
        const url = `${this.apiBaseUrl}/youtube/subscriptions${pageToken ? "?pageToken=" + pageToken : ""}`;
        const headers = this.getHeaders();
        const response = await fetch(url, {
            method: "GET",
            headers,
        });
        const data = await response.json();
        return data as SubscriptionResponse
    }

    /**
     * Gets the channel details of the given channel id
     * https://documenter.getpostman.com/view/17998957/UzXPwGN8#0192c0fe-21ee-4f18-83dc-76d79ecbd33b
     *
     * @param channelId - the id of the Channel to return
     */
    private async getChannelDetails(channelId: string): Promise<ChannelDetails> {
        const url = `${this.apiBaseUrl}/youtube/channels/${channelId}`;
        const headers = this.getHeaders();

        const response = await fetch(url, {
            method: "GET",
            headers,
        });
        const data = await response.json();
        return data as ChannelDetails
    }


    /**
     * Gets the playlist items for the playlist of the given playlist id
     * https://documenter.getpostman.com/view/17998957/UzXPwGN8#c53b6658-5243-4fbe-bbad-97660ad62067
     *
     * @param playlistId
     * @param pageToken
     */
    private async getPlaylistItemList(playlistId: string, pageToken?: string): Promise<PlaylistItemListResponse> {
        const url = `${this.apiBaseUrl}/youtube/playlist-items/${playlistId}${pageToken ? "?pageToken=" + pageToken : ""}`;
        const headers = this.getHeaders();

        const response = await fetch(url, {
            method: "GET",
            headers,
        });
        const data = await response.json();
        return data as PlaylistItemListResponse
    }
}

