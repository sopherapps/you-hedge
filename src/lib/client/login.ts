import { LoginDetails, AuthDetails } from "../types/dtos";
import { LoginDetailsResponse, LoginStatusRequest, LoginStatusResponse, RefreshTokenRequest, RefreshTokenResponse } from "../types/http";


/**
 * Initializes the login for the tv and returns a verification_url and device code
 * for the user to login with
 * in another device like a phone or a desktop
 * https://documenter.getpostman.com/view/17998957/UzXPwGN8#9afd33d1-aa1f-44cf-892d-3436d369030c
 *
 * @param apiBaseUrl - the base URL of the API
 */
export async function initializeLogin(apiBaseUrl: string): Promise<LoginDetails> {
    const response = await fetch(`${apiBaseUrl}/auth/tv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}"
    });
    const data: LoginDetailsResponse = await response.json();
    return new LoginDetails(data);
}

/**
 * After the user has signed in from another device, the app queries the authentication endpoint
 * to get the auth response
 * https://documenter.getpostman.com/view/17998957/UzXPwGN8#9be54a6c-21db-45ec-8a6e-b94e00a3cd99
 *
 * @param apiBaseUrl - the base URL of the API
 * @param request - the request sent to the api endpoint
 */
export async function getLoginResponse(apiBaseUrl: string, request: LoginStatusRequest): Promise<AuthDetails> {
    const url = `${apiBaseUrl}/auth/tv/${request.device_code}?interval=${request.interval}`;
    const response = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    const data: LoginStatusResponse = await response.json();
    return new AuthDetails(data)
}

/**
 * Refreshes the token by sending the refresh token
 * https://documenter.getpostman.com/view/17998957/UzXPwGN8#5ed94992-3f32-437c-83a6-c18d5f44a361
 *
 * @param apiBaseUrl
 * @param request
 */
export async function refreshToken(apiBaseUrl: string, request: RefreshTokenRequest): Promise<AuthDetails> {
    const url = `${apiBaseUrl}/auth/tv/refresh-token`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    const data: RefreshTokenResponse = await response.json();
    return new AuthDetails({ ...data, ...request })
}

