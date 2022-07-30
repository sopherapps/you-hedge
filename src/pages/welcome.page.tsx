// Page that shows the default welcome page with login option
import React, { useContext } from "react";
import logo from '../lib/assets/img/logo.svg';
import googleSignInBtn from '../lib/assets/img/google_signin.png';
import { LoginStatusContext } from "../lib/contexts";
import { LoginInitialized, LoginPending } from "../lib/types/state";
import { InstanceSwitch, SwitchCase } from "../components/InstanceSwitch";
import { LoginDetails } from "../lib/types/dtos";

export default function WelcomePage({ initLogin }: { initLogin: () => void }) {
    const loginStatus = useContext(LoginStatusContext);

    // TODO: Add the app loading as signing up is in progress.

    return (
        <div className="flex justify-center align-center h-100vh v-100vw">
            <div className="cta">
                <img src={logo} className="logo" alt="logo" />
                <p className="intro">
                    YouHedge protects your mental health by ensuring
                    you view only videos of channels you subscribe to
                    without being tempted by the feed and #shorts
                </p>
                <InstanceSwitch value={loginStatus}>
                    <SwitchCase condition={LoginInitialized}>
                        <p>
                            Please visit URL
                            <a target="_blank" href={(loginStatus?.details as LoginDetails)?.verificationUrl}>
                                <strong>{(loginStatus?.details as LoginDetails)?.verificationUrl}</strong>
                            </a>
                        </p>
                        <p>
                            And Feed in the Code <strong>{(loginStatus?.details as LoginDetails)?.userCode}</strong>
                        </p>
                    </SwitchCase>
                    <SwitchCase condition={LoginPending}>
                        <button onClick={initLogin} className="btn">
                            <img src={googleSignInBtn} className="google-signin" alt="Sign in with Google" />
                        </button>
                    </SwitchCase>
                </InstanceSwitch>
            </div>
        </div>
    );
}


