// Page that shows the default welcome page with login option
import React, { useContext } from "react";
import logo from './lib/assets/img/logo.svg';
import googleSignInBtn from './lib/assets/img/google_signin.png';
import { IsLoggedInContext, LoginDetailsContext } from "../contexts";

export default function WelcomePage({ initLogin }: { initLogin: () => void }) {
    const isLoggedIn = useContext(IsLoggedInContext);
    const { verificationUrl, deviceCode } = useContext(LoginDetailsContext);

    return (
        <div className="d-flex justify-center align-center full-height">
            <div className="cta">
                <img src={logo} className="logo" alt="logo" />
                <p>
                    We know how the YouTube feed and other social media feed
                    can endanger our mental health. However, YouTube has some important things
                    we still need so we can't just drop it.
                    YouHedge ensures you view only videos of channels you subscribe to
                    without being tempted by the feed and #shorts
                </p>
                {isLoggedIn ? (<p>
                    Please visit URL <strong>{verificationUrl}</strong> <br />
                    And Feed in the Code <strong>{deviceCode}</strong>
                </p>) :
                    (<button onClick={initLogin}>
                        <img src={googleSignInBtn} className="google-signin" alt="Sign in with Google" />
                    </button>)}
            </div>
        </div>
    );
}
