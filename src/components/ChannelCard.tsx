import { Channel } from "../lib/types/dtos";
import Avatar from "./Avatar";

interface IProps {
    channel: Channel;
    onClick: (channel: Channel) => void;
}

export default function ChannelCard({ channel, onClick }: IProps) {
    return <div className="card channel-card flex h-8 px-10 py-5 tablet-justify-center" onClick={() => onClick(channel)}>
        <Avatar imageUrl={channel.imageUrl} height="80%" />
        <div className="text desktop tv">{channel.title}</div>
    </div>
}