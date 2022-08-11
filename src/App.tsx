import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginStatusContext, ChannelsContext, PlaylistItemsContext } from './lib/contexts';
import WelcomePage from "./pages/welcome.page";
import HomePage from './pages/home.page';
import { AuthDetails, Channel, LoginDetails } from './lib/types/dtos';
import PlayerPage from './pages/player.page';
import { LoginFinalized, LoginInitialized, LoginPending, LoginStatus } from './lib/types/state';
import { InstanceSwitch, SwitchCase } from './components/InstanceSwitch';
import NotFoundPage from './pages/not-found.page';
import ProgressBar from './components/ProgressBar';
import { YoutubeClient } from './lib/client/youtube';
import { localStorageDb, sessionStorageDb } from './globals';
import { Store } from './lib/store';

const youtubeClient = new YoutubeClient({ db: localStorageDb, parent: window });
const store = new Store({ db: sessionStorageDb });


function App() {
    /**
     * States
     */
    const [loginStatus, setLoginStatus] = useState<LoginStatus | null>(null);
    const [channels, setChannels] = useState(store.channels);
    const [playlistItems, setPlayListItems] = useState(store.playlistItems);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Callbacks
     */
    const initLogin = useCallback(() => {
        setIsLoading(true);
        youtubeClient.getLoginDetails()
            .then(details => {
                setLoginStatus(l => l && l.initialize(details));
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const batchRefreshChannels = useCallback((pageToken?: string) => {
        if (!youtubeClient.isLoggedIn()) {
            setLoginStatus(new LoginPending());
            return;
        }

        setIsLoading(true);
        youtubeClient.getChannels(pageToken)
            .then(data => {
                store.addChannels(data);
                setChannels({ ...store.channels });
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const batchRefreshPlaylistItems = useCallback((channel: Channel, pageToken?: string) => {
        if (!youtubeClient.isLoggedIn()) {
            setLoginStatus(new LoginPending());
            return;
        }

        setIsLoading(true);
        youtubeClient.getPlaylistItems(channel, pageToken)
            .then(data => {
                store.addPlaylistItems(data);
                setPlayListItems({ ...store.playlistItems });
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    /**
     * Effects
     */
    useEffect(() => {
        // Attempt to skip login if youtube client is already logged in
        if (youtubeClient.isLoggedIn() && youtubeClient.authDetails) {
            setLoginStatus(new LoginFinalized(youtubeClient.authDetails));
        } else if (youtubeClient.isRefreshing) {
            setIsLoading(true);
            window.setTimeout(() => {
                if (youtubeClient.isLoggedIn() && youtubeClient.authDetails) {
                    setLoginStatus(new LoginFinalized(youtubeClient.authDetails));
                } else {
                    setLoginStatus(new LoginPending());
                }
                setIsLoading(false);
            }, 1000);
        } else {
            setLoginStatus(new LoginPending());
        }

    }, []);

    useEffect(() => {
        if (loginStatus instanceof LoginInitialized) {
            youtubeClient.finalizeLogin(loginStatus.details as LoginDetails).then(() => {
                if (youtubeClient.isLoggedIn()) {
                    setLoginStatus(loginStatus.finalize(youtubeClient.authDetails as AuthDetails));
                }
            }).catch(console.error);
        }
    }, [loginStatus]);

    useEffect(() => {
        if (JSON.stringify(channels) === "{}" && loginStatus instanceof LoginFinalized) {
            setIsLoading(true);
            youtubeClient.getChannels()
                .then((channelList) => {
                    store.addChannels(channelList);
                    setChannels({ ...store.channels });
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [loginStatus, channels]);

    return (
        <LoginStatusContext.Provider value={loginStatus}>
            <ChannelsContext.Provider value={channels}>
                <PlaylistItemsContext.Provider value={playlistItems}>
                    {isLoading && <ProgressBar />}
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={
                                <InstanceSwitch value={loginStatus}>
                                    <SwitchCase condition={null} children={<WelcomePage initLogin={initLogin} />} />
                                    <SwitchCase condition={LoginPending} children={<WelcomePage initLogin={initLogin} />} />
                                    <SwitchCase condition={LoginInitialized} children={<WelcomePage initLogin={initLogin} />} />
                                    <SwitchCase condition={LoginFinalized} children={
                                        <HomePage
                                            refreshChannelBatch={batchRefreshChannels}
                                            refreshPlaylistItemBatch={batchRefreshPlaylistItems} />
                                    } />
                                </InstanceSwitch>
                            } />
                            <Route path="player/:videoId" element={<PlayerPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </BrowserRouter>
                </PlaylistItemsContext.Provider>
            </ChannelsContext.Provider>
        </LoginStatusContext.Provider>
    );
}

export default App;
