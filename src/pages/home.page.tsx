import logo from "../lib/assets/img/logo.svg";
import smallLogo from "../lib/assets/img/small_logo.svg";
import { useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import { Channel } from "../lib/types/dtos";
import { ChannelsContext, PlaylistItemsContext } from "../lib/contexts";
import ChannelCard from "../components/ChannelCard";
import PlaylistItemCard from "../components/PlaylistItemCard";
import { Link, useSearchParams } from "react-router-dom";
import YScrollView, { YScrollData } from "../components/YScrollView";

interface IHomeProps {
    refreshChannelBatch: (pageToken?: string) => void,
    refreshPlaylistItemBatch: (channel: Channel, pageToken?: string) => void
}

export default function HomePage({ refreshChannelBatch, refreshPlaylistItemBatch }: IHomeProps) {
    /**
     * State
     */
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedChannelId = searchParams.get("channelId");
    const selectedVideoId = searchParams.get("videoId");
    const [playlistScrollTop, setPlayListScrollTop] = useState(0);
    const channels = useContext(ChannelsContext);
    const playlistItems = useContext(PlaylistItemsContext);
    const visibleChannels = useMemo(() => Object.values(channels)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()), [channels]);
    const [fetchedChannelIds, setFetchedChannelIds] = useState<{ [key: string]: boolean }>({});
    const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[selectedChannelId || visibleChannels[0]?.id]);
    const visiblePlayListItems = useMemo(() => Object.values(playlistItems)
        .filter((v) => v.channelId === selectedChannel?.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()), [playlistItems, selectedChannel?.id]);

    /**
     * Callbacks
     */
    const handleChannelClick = useCallback((channel: Channel) => {
        const lowerTimestampBound = new Date();
        lowerTimestampBound.setSeconds(lowerTimestampBound.getSeconds() - (5 * 60));

        if (channel.timestamp < lowerTimestampBound) {
            refreshChannelBatch(channel.pageToken);
            refreshPlaylistItemBatch(channel);
        } else if (fetchedChannelIds[channel.id] === undefined) {
            refreshPlaylistItemBatch(channel);
            setFetchedChannelIds({ ...fetchedChannelIds, [channel.id]: true });
        }
        setSelectedChannel(channel);
        setSearchParams({ channelId: channel.id });
    }, [fetchedChannelIds, refreshChannelBatch, refreshPlaylistItemBatch, setSearchParams]);

    const getMoreChannels = useCallback(({ isAtBottom, isDown }: YScrollData) => {
        if (channels && isDown && isAtBottom) {
            const latestChannel = Object.values(channels)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            latestChannel?.nextPageToken && refreshChannelBatch(latestChannel?.nextPageToken);
        }
    }, [channels, refreshChannelBatch]);

    const getMorePlaylistItems = useCallback(({ isAtBottom, isDown }: YScrollData) => {
        if (selectedChannel && playlistItems && isDown && isAtBottom) {
            const latestPlaylistItem = Object.values(playlistItems)
                .filter((v) => v.channelId === selectedChannel.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            latestPlaylistItem?.nextPageToken && refreshPlaylistItemBatch(selectedChannel, latestPlaylistItem?.nextPageToken);
        }
    }, [playlistItems, selectedChannel, refreshPlaylistItemBatch]);

    // Update the scroll view of playlists to have the selected item at the top
    useLayoutEffect(() => {
        if (selectedVideoId) {
            const element = document.getElementById(selectedVideoId);
            element && setPlayListScrollTop(element.getBoundingClientRect().top);
        }
    }, [selectedVideoId]);

    return (<div className="flex w-100 h-100vh">
        {/*Sidebar */}
        <div className="sidebar w-20 w-10-tablet h-100">
            <div className="logo-header slide-from-left h-10 w-100 tablet-text-center">
                <img className="logo desktop tv" src={logo} alt="YouHedge logo" />
                <img className="logo tablet-inline" src={smallLogo} alt="YouHedge logo" />
            </div>
            <YScrollView
                className="scrollview"
                onScroll={getMoreChannels}
                height="90%"
                width="100%"
            >
                {visibleChannels.length > 0 ?
                    visibleChannels.map(chan =>
                        <ChannelCard
                            channel={chan}
                            onClick={handleChannelClick}
                            key={chan.id}
                            className={chan.id === selectedChannelId ? "active" : ""}
                        />)
                    :
                    <div className="my-2">No channels yet</div>
                }
            </YScrollView>
        </div>
        {/* main content area */}
        <div className="content-area w-80 h-100 w-90-tablet">
            <YScrollView
                scrollTop={playlistScrollTop}
                onScroll={getMorePlaylistItems}
                height="100%"
                width="100%"
                className="grid grid-4-cols grid-3-rows px-5 py-3 px-2-tablet mobile-grid-1 small-tablet-grid-2 tablet-grid-3"
            >
                {visiblePlayListItems.length > 0 ?
                    visiblePlayListItems.map(item =>
                        <Link
                            to={`/player/${item.videoId}?title=${item.title}`}
                            key={item.videoId}
                            className="card-link"
                            id={item.videoId}
                        >
                            <PlaylistItemCard
                                item={item}
                            />
                        </Link>
                    )
                    :
                    <div className="my-2">No Videos yet</div>
                }
            </YScrollView>
        </div>
    </div>);
}
