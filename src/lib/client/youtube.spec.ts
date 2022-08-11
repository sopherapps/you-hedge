import localforage from "localforage";
import { sessionStorageDb } from "../../globals";
import { mockRefreshTokenRequest } from "../../mocks/requests";
import { mockLoginDetailsResponse, mockLoginStatusResponse, mockManyChannelsResponse, mockPlaylistItemListResponses, mockRefreshTokenResponse, mockSubscriptionsResponses } from "../../mocks/responses";
import { SessionStorageDb } from "../db";
import { AuthDetails, Channel, LoginDetails, PlaylistItem } from "../types/dtos";
import { YoutubeClient } from "./youtube";

let youtubeClient: YoutubeClient;
const testDb = new SessionStorageDb(localforage.createInstance({
    name: "youhedge-test-db",
    storeName: "sessionStorage",
    driver: localforage.LOCALSTORAGE,
}));

beforeEach(async () => {
    youtubeClient = new YoutubeClient({ db: sessionStorageDb, parent: window });
});

afterEach(async () => {
    await youtubeClient.destroy();
    await testDb.clear();
});

test("isLoggedIn checks whether client is logged in or not", () => {
    youtubeClient._stopRefresh();
    const beforeLogin = youtubeClient.isLoggedIn();
    youtubeClient.authDetails = new AuthDetails(mockLoginStatusResponse);
    const afterLogin = youtubeClient.isLoggedIn();
    expect(beforeLogin).toEqual(false);
    expect(afterLogin).toEqual(true);
}, 3000);

test("refreshAuthDetails attempts to refresh the access token", async () => {
    youtubeClient._stopRefresh();
    const authDetails = new AuthDetails(mockLoginStatusResponse);
    authDetails.expiresAt.setSeconds(new Date().getSeconds() - 4);
    youtubeClient.authDetails = authDetails;

    await youtubeClient.refreshAuthDetails(authDetails);
    const { expiresAt, ...expectedNewAuthDetails } = new AuthDetails({
        ...mockRefreshTokenRequest,
        ...mockRefreshTokenResponse,
    });

    expect(youtubeClient.isLoggedIn()).toBe(true);
    expect(youtubeClient.authDetails).toEqual(expect.objectContaining(expectedNewAuthDetails));
}, 3000);

test("getLoginDetails initializes login", async () => {
    youtubeClient._stopRefresh();
    const loginDetails = await youtubeClient.getLoginDetails();
    expect(loginDetails).toEqual(
        expect.objectContaining(new LoginDetails(mockLoginDetailsResponse)));
}, 3000);

test("finalizeLogin checks for login status after login initialisation", async () => {
    await youtubeClient._clearState();
    const authDetailsBeforeLogin = youtubeClient.authDetails;
    const isRefreshRunningBeforeLogin = youtubeClient._isRefreshInitialized();
    const detailsInDbBeforeLogin = await youtubeClient._getDataInDb();

    await youtubeClient.finalizeLogin(new LoginDetails(mockLoginDetailsResponse));

    const authDetailsAfterLogin = youtubeClient.authDetails;
    const isRefreshRunningAfterLogin = youtubeClient._isRefreshInitialized();
    const detailsInDbAfterLogin = await youtubeClient._getDataInDb();

    const { expiresAt, ...expectedAuthDetails } = new AuthDetails(mockLoginStatusResponse);

    expect(authDetailsBeforeLogin).toBe(undefined);
    expect(authDetailsAfterLogin).toEqual(expect.objectContaining(expectedAuthDetails));
    expect(isRefreshRunningBeforeLogin).toBe(false);
    expect(isRefreshRunningAfterLogin).toBe(true);
    expect(detailsInDbBeforeLogin).toBe(null);
    expect(detailsInDbAfterLogin).toEqual(expect.objectContaining({
        authDetails: expect.objectContaining(expectedAuthDetails)
    }));
}, 3000);

test("startTokenRefresh starts the cycle of refreshing the access token", (done) => {
    youtubeClient._stopRefresh();
    const isRefreshRunningBeforeStart = youtubeClient._isRefreshInitialized();

    youtubeClient.startTokenRefresh();
    setTimeout(() => {
        const authDetailsAfterRefresh = youtubeClient.authDetails;
        const isRefreshRunningAfterStart = youtubeClient._isRefreshInitialized();
        const expectedExpiresAt = new Date();
        expectedExpiresAt.setSeconds(
            expectedExpiresAt.getSeconds() + mockRefreshTokenResponse.expires_in);
        const { expiresAt, ...expectedNewAuthDetails } = new AuthDetails({
            ...mockRefreshTokenRequest, ...mockRefreshTokenResponse
        });

        expect(expiresAt.getTime()).toBeGreaterThanOrEqual(expectedExpiresAt.getTime());
        expect(isRefreshRunningBeforeStart).toBe(false);
        expect(isRefreshRunningAfterStart).toBe(true);
        expect(authDetailsAfterRefresh).toEqual(expect.objectContaining(expectedNewAuthDetails));

        done();
    }, youtubeClient.authDetails?.expiresIn);

}, 3000);

test("getChannels returns a list of channels", async () => {
    const expectedPageTokenToChannelsMap: { [key: string]: any[] } = {};

    for (const key in mockSubscriptionsResponses) {
        if (Object.prototype.hasOwnProperty.call(mockSubscriptionsResponses, key)) {
            const element = mockSubscriptionsResponses[key];
            expectedPageTokenToChannelsMap[key] = element.items
                .map((item, index) => {
                    const { timestamp, ...data } = new Channel(
                        element, mockManyChannelsResponse[item.snippet.resourceId.channelId], index);
                    return expect.objectContaining(data);
                });
        }
    }

    const firstSetOfChannels = await youtubeClient.getChannels();
    const setOfChannelsForYutth = await youtubeClient.getChannels("yutth");
    const setOfChannelsForPrev = await youtubeClient.getChannels("prev");

    expect(firstSetOfChannels).toEqual(expect.arrayContaining(expectedPageTokenToChannelsMap.prev));
    expect(setOfChannelsForPrev).toEqual(expect.arrayContaining(expectedPageTokenToChannelsMap.prev));
    expect(setOfChannelsForYutth).toEqual(expect.arrayContaining(expectedPageTokenToChannelsMap.yutth));
}, 3000);

test("getPlaylistItems gets a list of playlist items for playlist id", async () => {
    let channels: Channel[] = [];

    for (const key in mockSubscriptionsResponses) {
        if (Object.prototype.hasOwnProperty.call(mockSubscriptionsResponses, key)) {
            const element = mockSubscriptionsResponses[key];
            const data = element.items
                .map((item, index) => new Channel(
                    element, mockManyChannelsResponse[item.snippet.resourceId.channelId], index));
            channels = channels.concat(data);
        }
    }

    for (const chan of channels) {
        const rawPlaylistItemsResponses = mockPlaylistItemListResponses[chan.playlistId];
        for (const key in rawPlaylistItemsResponses) {
            if (Object.prototype.hasOwnProperty.call(rawPlaylistItemsResponses, key)) {
                const element = rawPlaylistItemsResponses[key];
                const expectedItems = element.items.map(value => {
                    const { timestamp, ...data } = new PlaylistItem(element, value, chan.id);
                    return expect.objectContaining(data);
                });

                const items = await youtubeClient.getPlaylistItems(chan, key);
                if (key === "prevTok") {
                    const defaultItems = await youtubeClient.getPlaylistItems(chan);
                    expect(defaultItems).toEqual(expect.arrayContaining(expectedItems));
                }

                expect(items).toEqual(expect.arrayContaining(expectedItems));
            }
        }
    }
}, 3000);