import { rest } from "msw";
import { apiBaseUrl } from "../globals";
import { mockLoginStatusRequest, mockRefreshTokenRequest } from "./requests";
import { mockLoginDetailsResponse, mockLoginStatusResponse, mockManyChannelsResponse, mockPlaylistItemListResponses, mockRefreshTokenResponse, mockSubscriptionsResponses } from "./responses";


const acceptedTokens = [
    mockLoginStatusResponse.access_token,
    mockRefreshTokenResponse.access_token,
]

export const handlers = [
    /**
     * Login client
     */
    rest.post(`${apiBaseUrl}/auth/tv`, (req, res, ctx) => {
        sessionStorage.setItem(
            mockLoginDetailsResponse.device_code,
            JSON.stringify(mockLoginStatusResponse));

        return res(
            ctx.status(200),
            ctx.json(mockLoginDetailsResponse))
    }),
    rest.get(`${apiBaseUrl}/auth/tv/:deviceId`, (req, res, ctx) => {
        const { deviceId } = req.params;
        const interval = req.url.searchParams.get("interval");
        if (deviceId === mockLoginStatusRequest.device_code &&
            interval === `${mockLoginDetailsResponse.interval}`) {
            return res(
                ctx.status(200),
                ctx.json(mockLoginStatusResponse));
        }

        return res(ctx.status(500), ctx.json({ error: "unknown internal error" }));
    }),
    rest.post(`${apiBaseUrl}/auth/refresh-token`, async (req, res, ctx) => {
        const { refresh_token } = await req.json();
        if (refresh_token === mockRefreshTokenRequest.refresh_token) {
            return res(
                ctx.status(200),
                ctx.json(mockRefreshTokenResponse)
            );
        }

        return res(ctx.status(500), ctx.json({ error: "unknown internal error" }));
    }),

    /**
     * Youtube client
     */
    rest.get(`${apiBaseUrl}/youtube/subscriptions`, (req, res, ctx) => {
        const accessToken = req.headers.get("X-YouHedge-Token");

        if (acceptedTokens.includes(accessToken as string)) {
            const pageToken: string | null = req.url.searchParams.get("pageToken");
            const response = pageToken ? mockSubscriptionsResponses[pageToken] : mockSubscriptionsResponses.prev;
            if (response) {
                return res(ctx.status(200), ctx.json(response));
            } else {
                return res(ctx.status(404), ctx.json({ error: "Not found" }));
            }
        }

        return res(ctx.status(401), ctx.json({ error: "Not authenticated" }));
    }),

    rest.get(`${apiBaseUrl}/youtube/channels/:channelId`, (req, res, ctx) => {
        const accessToken = req.headers.get("X-YouHedge-Token");

        if (acceptedTokens.includes(accessToken as string)) {
            const { channelId } = req.params;
            const response = mockManyChannelsResponse[channelId as string];

            if (response) {
                return res(ctx.status(200), ctx.json(response));
            } else {
                return res(ctx.status(404), ctx.json({ error: "Not found" }));
            }
        }

        return res(ctx.status(401), ctx.json({ error: "Not authenticated" }));
    }),

    rest.get(`${apiBaseUrl}/youtube/playlist-items/:playlistId`, (req, res, ctx) => {
        const accessToken = req.headers.get("X-YouHedge-Token");

        if (acceptedTokens.includes(accessToken as string)) {
            const { playlistId } = req.params;
            const playlist = mockPlaylistItemListResponses[playlistId as string];

            const pageToken = req.url.searchParams.get("pageToken");
            const response = pageToken ? playlist[pageToken] : playlist.prevTok;

            if (response) {
                return res(ctx.status(200), ctx.json(response));
            } else {
                return res(ctx.status(404), ctx.json({ error: "Not found" }));
            }
        }

        return res(ctx.status(401), ctx.json({ error: "Not authenticated" }));
    }),
]