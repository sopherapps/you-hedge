import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"

export default function PlayerPage() {
    const { videoId } = useParams();

    return <div className="h-100vh w-100vw">
        <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            height="100%"
            width="100%"
            style={{
                overflow: "hidden",
                height: "100%",
                width: "100%",
            }}
            frameBorder="0"
        />
    </div>
}