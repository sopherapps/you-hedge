import { ChannelBatchRefreshFunc, PlaylistItemBatchRefreshFunc } from "../lib/types/funcs";
import logo from "../lib/assets/img/logo.svg";
import { useCallback, useContext, useMemo, useState } from "react";
import { Channel } from "../lib/types/dtos";
import { ChannelsContext, PlaylistItemsContext } from "../contexts";
import ChannelCard from "../components/ChannelCard";
import PlaylistItemCard from "../components/PlaylistItemCard";
import { Link } from "react-router-dom";

interface IHomeProps {
    refreshChannelBatch: ChannelBatchRefreshFunc,
    refreshPlaylistItemBatch: PlaylistItemBatchRefreshFunc
}

export default function HomePage({ refreshChannelBatch, refreshPlaylistItemBatch }: IHomeProps) {
    /**
     * State
     */
    const channels = useContext(ChannelsContext);
    const playlistItems = useContext(PlaylistItemsContext);
    const [selectedChannel, setSelectedChannel] = useState<Channel>();

    const visibleChannels = useMemo(() =>
        Object.values(channels)
            .sort((a, b) => a.position - b.position), [channels]);

    const visiblePlaylistItems = useMemo(() =>
        Object.values(playlistItems)
            .filter((v) => v.channelId === selectedChannel?.id)
            .sort((a, b) => a.position - b.position), [playlistItems, selectedChannel]);

    /**
     * Callbacks
     */
    const handleChannelClick = useCallback((channel: Channel) => {
        setSelectedChannel(channel);
    }, [])


    return (<div className="flex w-100 h-100vh">
        {/*Sidebar */}
        <div className="sidebar w-20 h-100">
            <div className="h-10 w-100 p-2"><img className="logo" src={logo} /></div>
            <div className="scrollview h-90 w-100">
                {visibleChannels.map(chan =>
                    <ChannelCard
                        channel={chan}
                        onClick={handleChannelClick}
                        key={chan.id}
                    />)
                }
            </div>
        </div>
        {/* main content area */}
        <div className="content-area w-80 h-100">
            <div className="grid grid-4-cols w-100 h-100 px-5 py-2">
                {visiblePlaylistItems.map(item =>
                    <Link to={`/player/${item.videoId}`}>
                        <PlaylistItemCard
                            item={item}
                            key={item.id}
                        />
                    </Link>
                )
                }
            </div>
        </div>
    </div>);
}