import { Channel } from "../lib/types/dtos";
import Avatar from "./Avatar";

interface IProps {
    channel: Channel;
    onClick: (channel: Channel) => void;
}

export default function ChannelCard({ channel, onClick }: IProps) {
    return <div className="card h-10 w-100" onClick={() => onClick(channel)}>
        <Avatar imageUrl={channel.imageUrl} height="80%" />
        <span className="h3">{channel.title}</span>
    </div>
}