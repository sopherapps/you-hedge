import { ChannelDetails, LoginDetailsResponse, LoginStatusResponse, PlaylistItemListResponse, PlaylistItemResponse, SubscriptionResponse, } from "./http";

/**
 * DTOs
 */
export class LoginDetails {
    deviceCode: string;
    userCode: string;
    verificationUrl: string;
    interval: number;

    constructor({ user_code, verification_url, device_code, interval }: LoginDetailsResponse) {
        this.userCode = user_code;
        this.verificationUrl = verification_url;
        this.deviceCode = device_code;
        this.interval = interval;
    }
}

export class AuthDetails {
    accessToken: string;
    expiresAt: Date;
    expiresIn: number;
    refreshToken: string;

    constructor({ access_token, expires_in, refresh_token, }: LoginStatusResponse) {
        let expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

        this.expiresIn = expires_in;
        this.accessToken = access_token;
        this.expiresAt = expiresAt;
        this.refreshToken = refresh_token;
    }
}


export class Channel {
    id: string;
    position: number;
    title: string;
    description: string;
    imageUrl: string;
    playlistId: string;
    pageToken: string | undefined; // the page token used when querying for the corresponding subscription
    nextPageToken: string | undefined;
    timestamp: Date;

    constructor(subscriptionResponse: SubscriptionResponse, channelDetails: ChannelDetails, position: number) {
        this.id = channelDetails.id;
        this.position = position;
        this.title = channelDetails.snippet.title;
        this.description = channelDetails.snippet.description;
        this.imageUrl = channelDetails.snippet.thumbnails.high.url;
        this.playlistId = channelDetails.contentDetails.relatedPlaylists.uploads;
        this.pageToken = subscriptionResponse.prevPageToken;
        this.nextPageToken = subscriptionResponse.nextPageToken;
        this.timestamp = new Date();
    }
}

export class PlaylistItem {
    id: string;
    channelId: string;
    position: number;
    title: string;
    description: string;
    imageUrl: string;
    videoId: string;
    pageToken: string | undefined; // the page token used when querying for the given playlist item
    nextPageToken: string | undefined;
    timestamp: Date;

    constructor(playlistItemListResponse: PlaylistItemListResponse, playlistItemResponse: PlaylistItemResponse, channelId: string) {
        this.id = playlistItemResponse.id;
        this.position = playlistItemResponse.snippet.position;
        this.title = playlistItemResponse.snippet.title;
        this.description = playlistItemResponse.snippet.description;
        this.imageUrl = playlistItemResponse.snippet.thumbnails?.high?.url || playlistItemResponse.snippet.thumbnails?.medium?.url || playlistItemResponse.snippet.thumbnails?.default?.url;
        this.channelId = channelId;
        this.pageToken = playlistItemListResponse.prevPageToken;
        this.nextPageToken = playlistItemListResponse.nextPageToken;
        this.videoId = playlistItemResponse.snippet.resourceId.videoId;
        this.timestamp = new Date();
    }
}
