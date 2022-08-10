import { LoginDetailsResponse, LoginStatusResponse, RefreshTokenResponse } from "../lib/types/http";

export const mockLoginDetailsResponse: LoginDetailsResponse = {
    device_code: "someDecideCode",
    user_code: "SOME-USER-CODE",
    verification_url: "http://example.com",
    expires_in: 120, // two minutes
    interval: 3
};
export const mockLoginStatusResponse: LoginStatusResponse = {
    access_token: "someAccessToken",
    token_type: "Bearer",
    expires_in: 120,
    refresh_token: "someRefreshToken"
};
export const mockRefreshTokenResponse: RefreshTokenResponse = {
    access_token: "anotherAccessToken",
    expires_in: 120,
    scope: "youtube",
    token_type: "Bearer"
};