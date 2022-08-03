import logo from "../lib/assets/img/logo.svg";
import smallLogo from "../lib/assets/img/small_logo.svg";
import { useCallback, useContext, useEffect, useMemo, useState, WheelEvent } from "react";
import { Channel } from "../lib/types/dtos";
import { ChannelsContext, PlaylistItemsContext } from "../lib/contexts";
import ChannelCard from "../components/ChannelCard";
import PlaylistItemCard from "../components/PlaylistItemCard";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { SwipeEventData, useSwipeable } from "react-swipeable";

interface IHomeProps {
    refreshChannelBatch: (pageToken?: string) => void,
    refreshPlaylistItemBatch: (channel: Channel, pageToken?: string) => void
}

export default function HomePage({ refreshChannelBatch, refreshPlaylistItemBatch }: IHomeProps) {
    /**
     * State
     */
    const channels = useContext(ChannelsContext);
    const playlistItems = useContext(PlaylistItemsContext);
    const [fetchedChannelIds, setFetchedChannelIds] = useState<{ [key: string]: boolean }>({});
    const [selectedChannel, setSelectedChannel] = useState<Channel>();

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
    }, [fetchedChannelIds, refreshChannelBatch, refreshPlaylistItemBatch]);

    const getMoreChannels = useCallback((ev: WheelEvent | SwipeEventData) => {
        // @ts-ignore
        const isScrollDown = (ev?.dir === "Up" || ev.deltaY > 0);

        if (channels && isScrollDown) {
            const latestChannel = Object.values(channels)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            latestChannel?.nextPageToken && refreshChannelBatch(latestChannel?.nextPageToken);
        }
    }, [channels, refreshChannelBatch]);

    const getMorePlaylistItems = useCallback((ev: WheelEvent | SwipeEventData) => {
        // @ts-ignore
        const isScrollDown = (ev?.dir === "Up" || ev.deltaY > 0);

        if (selectedChannel && playlistItems && isScrollDown) {
            const latestPlaylistItem = Object.values(playlistItems)
                .filter((v) => v.channelId === selectedChannel.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            latestPlaylistItem?.nextPageToken && refreshPlaylistItemBatch(selectedChannel, latestPlaylistItem?.nextPageToken);
        }
    }, [playlistItems, selectedChannel, refreshPlaylistItemBatch]);

    const onScrollChannels = useMemo(
        () => debounce(getMoreChannels, 300), [getMoreChannels]);
    const onScrollPlaylistItems = useMemo(
        () => debounce(getMorePlaylistItems, 300), [getMorePlaylistItems]);
    const swipeChannelListHandlers = useSwipeable({
        onSwipedUp: onScrollChannels,
    });
    const swipePlaylistItemsListHandlers = useSwipeable({
        onSwipedUp: onScrollPlaylistItems,
    });

    /**
     * Effects
     */
    useEffect(() => {
        return () => {
            onScrollPlaylistItems.cancel();
            onScrollChannels.cancel();
        };
    }, [onScrollChannels, onScrollPlaylistItems]);


    return (<div className="flex w-100 h-100vh">
        {/*Sidebar */}
        <div className="sidebar w-20 w-10-tablet h-100">
            <div className="logo-header h-10 w-100 tablet-text-center">
                <img className="logo desktop tv" src={logo} alt="YouHedge logo" />
                <img className="logo tablet-inline" src={smallLogo} alt="YouHedge logo" />
            </div>
            <div className="scrollview h-90 w-100" onWheel={onScrollChannels} {...swipeChannelListHandlers}>
                {channels ? Object.values(channels)
                    .sort((a, b) => a.position - b.position).map(chan =>
                        <ChannelCard
                            channel={chan}
                            onClick={handleChannelClick}
                            key={chan.id}
                        />) : <div>No channels yet</div>
                }
            </div>
        </div>
        {/* main content area */}
        <div className="content-area w-80 h-100 w-90-tablet" onWheel={onScrollPlaylistItems} {...swipePlaylistItemsListHandlers}>
            <div className="grid grid-4-cols grid-3-rows w-100 h-100 px-5 py-3 px-2-tablet mobile-grid-1 small-tablet-grid-2 tablet-grid-3">
                {playlistItems ? Object.values(playlistItems)
                    .filter((v) => v.channelId === selectedChannel?.id)
                    .sort((a, b) => a.position - b.position).map(item =>
                        <Link
                            to={`/player/${item.videoId}?title=${item.title}`}
                            key={item.videoId}
                        >
                            <PlaylistItemCard
                                item={item}
                            />
                        </Link>
                    ) : <div>No Videos yet</div>
                }
            </div>
        </div>
    </div>);
}