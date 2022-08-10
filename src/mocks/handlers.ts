import { rest } from "msw";
import { apiBaseUrl } from "../globals";
import { mockLoginDetailsResponse, mockLoginStatusResponse, mockRefreshTokenResponse } from "./responses";


export const handlers = [
    rest.post(`${apiBaseUrl}/auth/tv`, (req, res, ctx) => {
        sessionStorage.setItem(
            mockLoginDetailsResponse.device_code,
            JSON.stringify(mockLoginStatusResponse));
        sessionStorage.setItem(
            mockLoginStatusResponse.refresh_token,
            JSON.stringify(mockRefreshTokenResponse))

        return res(
            ctx.status(200),
            ctx.json(mockLoginDetailsResponse))
    }),
    rest.get(`${apiBaseUrl}/auth/tv/:deviceId`, (req, res, ctx) => {
        const { deviceId } = req.params;
        const interval = req.url.searchParams.get("interval")
        const loginDetailsStr = sessionStorage.getItem(deviceId as string);
        if (loginDetailsStr && interval === `${mockLoginDetailsResponse.interval}`) {
            return res(
                ctx.status(200),
                ctx.json(JSON.parse(loginDetailsStr)));
        }

        return res(ctx.status(500), ctx.json({ error: "unknown internal error" }));
    }),
    rest.post(`${apiBaseUrl}/auth/refresh-token`, async (req, res, ctx) => {
        const { refresh_token } = await req.json();
        const authDetailsStr = sessionStorage.getItem(refresh_token as string);
        if (authDetailsStr) {
            return res(
                ctx.status(200),
                ctx.json(JSON.parse(authDetailsStr))
            );
        }

        return res(ctx.status(500), ctx.json({ error: "unknown internal error" }));
    }),
]