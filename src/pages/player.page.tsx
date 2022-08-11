import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BrowserHistory } from "history";
import { UNSAFE_NavigationContext, useNavigate, useParams, useSearchParams } from "react-router-dom"
import useScreenSize from "../lib/hooks/useScreenSize";
import useScreenOrientation from "../lib/hooks/useScreenOrientation";

export default function PlayerPage() {
    const { videoId } = useParams();
    const [searchParams] = useSearchParams();
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const screenSize = useScreenSize();
    const orientation = useScreenOrientation();
    const navigate = useNavigate();
    const navigation = useContext(UNSAFE_NavigationContext).navigator as BrowserHistory;
    const paddingBottom = useMemo(() => ["portrait-primary", "portrait-secondary"].includes(orientation) ? "10%" : "2%", [orientation]);

    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const setIframeSize = useCallback(([width, height]: [number, number]) => {
        const iframe = iframeRef.current;
        if (iframe) {
            const src = iframe.getAttribute('src');
            if (src) {
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage(JSON.stringify({
                        'event': 'command',
                        'func': "setSize",
                        'args': [width, height]
                    }), '*');
                }
            }
        }
    }, [iframeRef]);

    /**
     * effects
     */
    useLayoutEffect(() => {
        if (navigation) {
            navigation.listen(({ action, location }) => {
                if (action === "POP") {
                    let search = `?videoId=${videoId}`;
                    if (location.search) {
                        search = `${location.search.split("&videoId")[0]}&videoId=${videoId}`;
                    }

                    navigate(`${location.pathname}${search}`);
                }
            });
        }
    }, [navigation, navigate, videoId]);

    useEffect(() => {
        setIframeSize(screenSize);
    }, [screenSize, setIframeSize, orientation]);


    return <div className="player h-100vh w-100vw">
        <div role="button" className="floating-btn text-center" onClick={goBack}>
            <div className="text-center icon i-back">&larr;</div>
            <div className="text-center">Back</div>
        </div>
        <iframe
            data-testid="youtube-iframe"
            ref={iframeRef}
            title={searchParams.get("title") || "A Youtube Video"}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            style={{
                overflow: "hidden",
                height: "100%",
                width: "100%",
                paddingBottom,
                backgroundColor: "#000",
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="slide-from-clear"
        />
    </div>
}
