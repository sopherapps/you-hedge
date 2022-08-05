import { useContext, useLayoutEffect } from "react";
import { BrowserHistory } from "history";
import { UNSAFE_NavigationContext, useNavigate, useParams, useSearchParams } from "react-router-dom"

export default function PlayerPage() {
    const { videoId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const navigation = useContext(UNSAFE_NavigationContext).navigator as BrowserHistory;
    useLayoutEffect(() => {
        if (navigation) {
            navigation.listen(({ action, location }) => {
                if (action === "POP") {
                    const search = location.search.split("&videoId")[0];
                    navigate(`${location.pathname}${search}&videoId=${videoId}`);
                }
            });
        }
    }, [navigation, navigate, videoId]);


    return <div className="player h-100vh w-100vw">
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
            className="slide-from-clear"
        />
    </div>
}
