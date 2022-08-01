import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginStatusContext, ChannelsContext, PlaylistItemsContext } from './lib/contexts';
import WelcomePage from "./pages/welcome.page";
import { YoutubeClient } from "./lib/client/youtube";
import { Store } from './lib/store';
import HomePage from './pages/home.page';
import { AuthDetails, Channel, LoginDetails } from './lib/types/dtos';
import PlayerPage from './pages/player.page';
import { LoginFinalized, LoginInitialized, LoginPending, LoginStatus } from './lib/types/state';
import { InstanceSwitch, SwitchCase } from './components/InstanceSwitch';
import NotFoundPage from './pages/NotFound.page';

const youtubeClient = new YoutubeClient();
const store = new Store();

function App() {
    /**
     * States
     */
    const [loginStatus, setLoginStatus] = useState<LoginStatus>(new LoginPending());
    const [channels, setChannels] = useState(store.channels);
    const [playlistItems, setPlayListItems] = useState(store.playlistItems);

    /**
     * Callbacks
     */
    const initLogin = useCallback(() => {
        youtubeClient.getLoginDetails().then(details => {
            setLoginStatus(l => l.initialize(details));
        }).catch(console.error);
    }, []);

    const batchRefreshChannels = useCallback((pageToken?: string) => {
        if (!youtubeClient.isLoggedIn()) {
            setLoginStatus(new LoginPending());
            return;
        }
        youtubeClient.getChannels(pageToken).then(data => {
            store.addChannels(data);
            setChannels({ ...store.channels });
        }).catch(console.error);
    }, []);

    const batchRefreshPlaylistItems = useCallback((channel: Channel, pageToken?: string) => {
        if (!youtubeClient.isLoggedIn()) {
            setLoginStatus(new LoginPending());
            return;
        }

        youtubeClient.getPlaylistItems(channel, pageToken).then(data => {
            store.addPlaylistItems(data);
            setPlayListItems({ ...store.playlistItems });
        }).catch(console.error);
    }, []);

    /**
     * Effects
     */
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
            youtubeClient.getChannels().then((channelList) => {
                store.addChannels(channelList);
                setChannels({ ...store.channels });
            }).catch(console.error);
        }
    }, [loginStatus, channels]);

    return (
        <LoginStatusContext.Provider value={loginStatus}>
            <ChannelsContext.Provider value={channels}>
                <PlaylistItemsContext.Provider value={playlistItems}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={
                                <InstanceSwitch value={loginStatus}>
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
