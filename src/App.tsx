import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IsLoggedInContext, LoginDetailsContext, ChannelsContext, PlaylistItemsContext } from './contexts';
import WelcomePage from "./pages/welcome.page";
import { YoutubeClient } from "./client/youtube";
import { Store } from './store';
import HomePage from './pages/home.page';
import { Channel, LoginDetails } from './types/dtos';
import PlayerPage from './pages/player.page';

const youtubeClient = new YoutubeClient();
const store = new Store();

function App() {
    /**
     * States
     */
    const [isLoggedIn, setIsLoggedIn] = useState(youtubeClient.isLoggedIn);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginDetails, setLoginDetails] = useState<LoginDetails>(new LoginDetails({
        user_code: "",
        verification_url: "",
        device_code: "",
        interval: 0,
        expires_in: 0
    }));
    const [channels, setChannels] = useState(store.channels);
    const [playlistItems, setPlayListItems] = useState(store.playlistItems);

    /**
     * Callbacks
     */
    const initLogin = useCallback(() => {
        youtubeClient.getLoginDetails().then(data => {
            setLoginDetails(data);
            setIsLoggingIn(true);
        }).catch(console.error);
    }, [youtubeClient]);

    const batchRefreshChannels = useCallback((pageToken?: string) => {
        youtubeClient.getChannels(pageToken).then(data => {
            store.addChannels(data);
            setChannels(store.channels);
        }).catch(console.error);
    }, [youtubeClient, store, setChannels]);

    const batchRefreshPlaylistItems = useCallback((channel: Channel, pageToken?: string) => {
        youtubeClient.getPlaylistItems(channel, pageToken).then(data => {
            store.addPlaylistItems(data);
            setPlayListItems(store.playlistItems);
        }).catch(console.error);
    }, [youtubeClient, store, setPlayListItems]);

    /**
     * Effects
     */
    useEffect(() => {
        if (isLoggingIn) {
            youtubeClient.finalizeLogin(loginDetails).then(() => {
                if (youtubeClient.isLoggedIn()) {
                    setIsLoggedIn(true);
                }
                setIsLoggingIn(false);
            }).catch(console.error);
        }
    }, [youtubeClient, isLoggingIn, setIsLoggedIn, setIsLoggingIn]);

    useEffect(() => {
        if (JSON.stringify(channels) === "{}" && isLoggedIn) {
            youtubeClient.getChannels().then((channelList) => {
                store.addChannels(channelList);
                setChannels(store.channels);
            }).catch(console.error);
        }
    }, [youtubeClient, isLoggedIn, store]);

    // TODO: I need to set up a way of updating a given batch of playlists or channels (basing 
    // on the channelId, pageToken tuple or pageToken respectively) when any is found to be stale
    // i.e. has a timestamp that is earlier than current timestamp by more than the selected TTL.

    return (
        <IsLoggedInContext.Provider value={isLoggedIn}>
            <LoginDetailsContext.Provider value={loginDetails}>
                <ChannelsContext.Provider value={channels}>
                    <PlaylistItemsContext.Provider value={playlistItems}>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<WelcomePage initLogin={initLogin} />} />
                                <Route path='list' element={<HomePage
                                    refreshChannelBatch={batchRefreshChannels}
                                    refreshPlaylistItemBatch={batchRefreshPlaylistItems} />} />
                                <Route path="player" element={<PlayerPage />} />
                            </Routes>
                        </BrowserRouter>
                    </PlaylistItemsContext.Provider>
                </ChannelsContext.Provider>
            </LoginDetailsContext.Provider>
        </IsLoggedInContext.Provider>
    );
}

export default App;
