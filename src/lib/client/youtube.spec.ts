import { getMockPageTokenChannelStructs, getMockPlaylistItemsStructs } from "../../mocks/dtos";
import { MockLocalForage } from "../../mocks/localforage";
import { mockRefreshTokenRequest } from "../../mocks/requests";
import { mockLoginDetailsResponse, mockLoginStatusResponse, mockManyChannelsResponse, mockPlaylistItemListResponses, mockRefreshTokenResponse, mockSubscriptionsResponses } from "../../mocks/responses";
import { Db, SessionStorageDb } from "../db";
import { AuthDetails, Channel, LoginDetails, PlaylistItem } from "../types/dtos";
import { YoutubeClient } from "./youtube";

let youtubeClient: YoutubeClient;

let testDb: Db = new SessionStorageDb(new MockLocalForage());

beforeEach(() => {
    youtubeClient = new YoutubeClient({ db: testDb, parent: window });
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


test("startTokenRefresh in service worker starts the cycle of refreshing the access token", (done) => {
    if ('serviceWorker' in navigator) {
        const db = new SessionStorageDb(new MockLocalForage());
        const swEnabledYoutubeClient = new YoutubeClient({ db, parent: window });
        swEnabledYoutubeClient._stopRefresh();
        swEnabledYoutubeClient.shouldRefreshInServiceWorker = true;
        const swSelf: Window = self;
        swEnabledYoutubeClient.authDetails = new AuthDetails(mockLoginStatusResponse);
        db.set("YoutubeClient", { authDetails: swEnabledYoutubeClient.authDetails });
        const isRefreshRunningBeforeStart = swEnabledYoutubeClient._isRefreshInitialized();
        const authDetailsBeforeLogin = swEnabledYoutubeClient.authDetails;

        const swHandler = (event: any) => {
            if (event.data && event.data.type === 'START_TOKEN_REFRESH') {
                const swYoutubeClient = new YoutubeClient({ db, parent: swSelf });
                const handle = swSelf.setInterval(() => {
                    if (!swYoutubeClient.isRefreshing) {
                        swYoutubeClient.scheduleNextTokenRefreshTask(true, event.source as Client);
                        swSelf.clearInterval(handle);
                    }
                }, 100);
            }
        };

        swSelf.addEventListener('message', swHandler);
        // @ts-ignore
        navigator.serviceWorker.register("/", { self: swSelf }).then(() => {
            swEnabledYoutubeClient.startTokenRefresh();

            setTimeout(() => {
                const authDetailsAfterRefresh = swEnabledYoutubeClient.authDetails;
                const isRefreshRunningAfterStart = swEnabledYoutubeClient._isRefreshInitialized();
                const expectedExpiresAt = new Date();
                expectedExpiresAt.setSeconds(
                    expectedExpiresAt.getSeconds() + mockRefreshTokenResponse.expires_in);
                const { expiresAt, ...expectedNewAuthDetails } = new AuthDetails({
                    ...mockRefreshTokenRequest, ...mockRefreshTokenResponse
                });
                const { expiresAt: _, ...expectedOldAuthDetails } = new AuthDetails(mockLoginStatusResponse);

                expect(expiresAt.getTime()).toBeGreaterThanOrEqual(expectedExpiresAt.getTime());
                expect(isRefreshRunningBeforeStart).toBe(false);
                expect(isRefreshRunningAfterStart).toBe(false);
                expect(authDetailsBeforeLogin).toEqual(expect.objectContaining(expectedOldAuthDetails));
                expect(authDetailsAfterRefresh).toEqual(expect.objectContaining(expectedNewAuthDetails));

                done();
            }, swEnabledYoutubeClient.authDetails?.expiresIn as number + 3000);
        });
    } else {
        done();
    }

}, 6000);

test("startTokenRefresh starts the cycle of refreshing the access token", (done) => {
    youtubeClient._stopRefresh();
    const isRefreshRunningBeforeStart = youtubeClient._isRefreshInitialized();
    youtubeClient.authDetails = new AuthDetails(mockLoginStatusResponse);

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
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    for (const { pageToken, channel } of mockPageTokenChannelStructs) {
        const { timestamp, ...data } = channel;
        expectedPageTokenToChannelsMap[pageToken] = expectedPageTokenToChannelsMap[pageToken] || [];
        expectedPageTokenToChannelsMap[pageToken].push(expect.objectContaining(data));
    }

    youtubeClient.authDetails = new AuthDetails(mockLoginStatusResponse);

    const firstSetOfChannels = await youtubeClient.getChannels();
    const setOfChannelsForYutth = await youtubeClient.getChannels("yutth");
    const setOfChannelsForPrev = await youtubeClient.getChannels("prev");

    expect(firstSetOfChannels).toEqual(expect.arrayContaining(expectedPageTokenToChannelsMap.prev));
    expect(setOfChannelsForPrev).toEqual(expect.arrayContaining(expectedPageTokenToChannelsMap.prev));
    expect(setOfChannelsForYutth).toEqual(expect.arrayContaining(expectedPageTokenToChannelsMap.yutth));
}, 3000);

test("getPlaylistItems gets a list of playlist items for playlist id", async () => {
    youtubeClient.authDetails = new AuthDetails(mockLoginStatusResponse);
    const mockPlaylistItemStructs = getMockPlaylistItemsStructs();

    for (const { channel, playlist } of mockPlaylistItemStructs) {
        const { pageToken } = playlist;
        const expectedItems = playlist.items.map(({ timestamp, ...data }) => expect.objectContaining(data));

        const items = await youtubeClient.getPlaylistItems(channel, pageToken);
        if (pageToken === "prevTok") {
            const defaultItems = await youtubeClient.getPlaylistItems(channel);
            expect(defaultItems).toEqual(expect.arrayContaining(expectedItems));
        }

        expect(items).toEqual(expect.arrayContaining(expectedItems));
    }


}, 3000);


