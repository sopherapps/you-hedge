import { Channel } from "../lib/types/dtos";
import Avatar from "./Avatar";

interface IProps {
    channel: Channel;
    onClick: (channel: Channel) => void;
    className?: string;
}

export default function ChannelCard({ className = "", channel, onClick }: IProps) {
    return <div className={`card channel-card slide-from-left flex h-8 px-10 py-5 tablet-justify-center ${className}`} onClick={() => onClick(channel)}>
        <Avatar imageUrl={channel.imageUrl} height="80%" />
        <div className="text desktop tv">{channel.title}</div>
    </div>
}