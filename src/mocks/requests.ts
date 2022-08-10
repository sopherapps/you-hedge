import { LoginStatusRequest, RefreshTokenRequest } from "../lib/types/http";

export const mockLoginStatusRequest: LoginStatusRequest = {
    device_code: "someDecideCode",
    interval: 3
}

export const mockRefreshTokenRequest: RefreshTokenRequest = {
    refresh_token: "someRefreshToken",
}