import { useMemo } from "react";
import { PlaylistItem } from "../lib/types/dtos";

export default function PlaylistItemCard({ item }: { item: PlaylistItem }) {
    const title = useMemo(
        () => `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`,
        [item]);

    return <div className="card playlist-item-card h-100">
        <div className="card-header h-70 w-100">
            <img
                src={item.imageUrl}
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                alt={title}
            />
        </div>
        <div className="card-body p-3 h-30 w-100">
            <p className="h6 subtitle">{title}</p>
        </div>
    </div>
}