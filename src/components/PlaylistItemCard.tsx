import { PlaylistItem } from "../lib/types/dtos";

export default function PlaylistItemCard({ item }: { item: PlaylistItem }) {
    return <div className="card h-30vh w-30% m-2%">
        <div className="h-60% w-100%">
            <img src={item.imageUrl} style={{ minHeight: "100%", minWidth: "100%" }} />
        </div>
        <div className="h-40% w-100% p-3%">
            <h3 className="subtitle">{item.title}</h3>
            <p className="description">{item.description}</p>
        </div>
    </div>
}