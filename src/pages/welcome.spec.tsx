import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { LoginStatusContext } from "../lib/contexts";
import { LoginDetails } from "../lib/types/dtos";
import { LoginInitialized, LoginPending } from "../lib/types/state";
import { render } from "../mocks/router";
import WelcomePage from "./welcome.page";

test("renders 'loading' before login is initialized", () => {
    const loginStatus = null;

    render(
        (
            <LoginStatusContext.Provider value={loginStatus}>
                <Routes>
                    <Route path="/" element={<WelcomePage initLogin={() => { }} />} />
                </Routes>
            </LoginStatusContext.Provider>
        ),
        { routesReplay: [`/`] }
    );

    const loadingElement = screen.getByText(/loading/i);
    expect(loadingElement).toBeInTheDocument();
});

test("renders login URL and code when login is initialized", () => {
    const user_code = "FOO-BAR";
    const verification_url = "http://you.com";
    const loginDetails = new LoginDetails({ user_code, verification_url, device_code: "some-stuff", interval: 7, expires_in: 9 });

    const loginStatus = new LoginInitialized(loginDetails);

    render(
        (
            <LoginStatusContext.Provider value={loginStatus}>
                <Routes>
                    <Route path="/" element={<WelcomePage initLogin={() => { }} />} />
                </Routes>
            </LoginStatusContext.Provider>
        ),
        { routesReplay: [`/`] }
    );

    const verificationUrlElement = screen.getByText(new RegExp(verification_url, "i"));
    const loginCodeElement = screen.getByText(new RegExp(user_code, "i"));

    expect(verificationUrlElement).toBeInTheDocument();
    expect(loginCodeElement).toBeInTheDocument();

});

test("renders login button when login is pending", () => {
    const loginStatus = new LoginPending();

    render(
        (
            <LoginStatusContext.Provider value={loginStatus}>
                <Routes>
                    <Route path="/" element={<WelcomePage initLogin={() => { }} />} />
                </Routes>
            </LoginStatusContext.Provider>
        ),
        { routesReplay: [`/`] }
    );

    const googleLoginButton = screen.getByAltText(/sign in with google/i);
    expect(googleLoginButton).toBeInTheDocument();
});

test("login button initializes login when pressed", () => {
    const loginStatus = new LoginPending();
    const mockInitializeLogin = jest.fn();

    render(
        (
            <LoginStatusContext.Provider value={loginStatus}>
                <Routes>
                    <Route path="/" element={<WelcomePage initLogin={mockInitializeLogin} />} />
                </Routes>
            </LoginStatusContext.Provider>
        ),
        { routesReplay: [`/`] }
    );

    const googleLoginButton = screen.getByAltText(/sign in with google/i);
    userEvent.click(googleLoginButton);

    expect(mockInitializeLogin).toBeCalledTimes(1);
});