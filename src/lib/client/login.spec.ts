import { apiBaseUrl } from "../../globals";
import { mockLoginStatusRequest, mockRefreshTokenRequest } from "../../mocks/requests";
import { mockLoginDetailsResponse, mockLoginStatusResponse, mockRefreshTokenResponse } from "../../mocks/responses";
import { AuthDetails, LoginDetails } from "../types/dtos";
import { initializeLogin, getLoginResponse, refreshToken } from "./login";

test("initializeLogin makes POST to api's initialize login endpoint", async () => {
    const loginDetails = await initializeLogin(apiBaseUrl as string);
    const expectedResponse = new LoginDetails(mockLoginDetailsResponse);
    expect(loginDetails).toEqual(expect.objectContaining(expectedResponse));
}, 3000);

test("getLoginResponse makes GET to api's getLoginResponse endpoint", async () => {
    const loginStatusResponse = await getLoginResponse(apiBaseUrl as string, mockLoginStatusRequest);
    const expectedResponse = new AuthDetails(mockLoginStatusResponse);
    expect(loginStatusResponse).toEqual(expect.objectContaining(expectedResponse));
}, 3000);

test("refreshToken makes POST to api's refreshToken endpoint", async () => {
    const refreshTokenResponse = await refreshToken(apiBaseUrl as string, mockRefreshTokenRequest);
    const expectedResponse = new AuthDetails({
        ...mockRefreshTokenResponse,
        ...mockRefreshTokenRequest
    });
    expect(refreshTokenResponse).toEqual(expect.objectContaining(expectedResponse));
}, 3000);
