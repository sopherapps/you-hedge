// Page that shows the default welcome page with login option
import React, { useContext, useEffect, useState } from "react";
import logo from '../lib/assets/img/logo.svg';
import googleSignInBtn from '../lib/assets/img/google_signin.png';
import { LoginStatusContext } from "../lib/contexts";
import { LoginInitialized, LoginPending } from "../lib/types/state";
import { InstanceSwitch, SwitchCase } from "../components/InstanceSwitch";
import { LoginDetails } from "../lib/types/dtos";

export default function WelcomePage({ initLogin }: { initLogin: () => void }) {
    const loginStatus = useContext(LoginStatusContext);
    const [intro, setIntro] = useState("");

    useEffect(() => {
        let handle: number;

        if (loginStatus === null) {
            setIntro("Loading");
            handle = window.setInterval(() => setIntro(v => `${v}.`), 1000);
        } else {
            setIntro(`
            YouHedge protects your mental health by ensuring
            you view only videos of channels you subscribe to
            without being tempted by the feed and #shorts
            `);
        }

        return () => window.clearInterval(handle);
    }, [loginStatus]);

    return (
        <div className="flex justify-center align-center h-100vh v-100vw ">
            <div className="cta">
                <img src={logo} className="logo" alt="logo" />
                <p className="intro">
                    {intro}
                </p>
                <InstanceSwitch value={loginStatus}>
                    <SwitchCase condition={LoginInitialized}>
                        <div className="mb-3">
                            <div className="mb-1">Please visit URL:</div>
                            <div>
                                <a target="_blank" rel="noreferrer" href={(loginStatus?.details as LoginDetails)?.verificationUrl}>
                                    <strong className="h5">{(loginStatus?.details as LoginDetails)?.verificationUrl}</strong>
                                </a>
                            </div>
                        </div>
                        <div>
                            <div className="mb-1">And Feed in the Code:</div>
                            <strong className="h4">{(loginStatus?.details as LoginDetails)?.userCode}</strong>
                        </div>
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


