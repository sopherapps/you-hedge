import { useParams, useSearchParams } from "react-router-dom"

export default function PlayerPage() {
    const { videoId } = useParams();
    const [searchParams] = useSearchParams();


    return <div className="h-100vh w-100vw">
        <iframe
            title={searchParams.get("title") || "A Youtube Video"}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            height="100%"
            width="100%"
            style={{
                overflow: "hidden",
                height: "100%",
                width: "100%",
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    </div>
}