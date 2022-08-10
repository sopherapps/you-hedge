import { useCallback, useContext, useLayoutEffect, useRef } from "react";
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
                    const search = location.search.split("&videoId")[0];
                    navigate(`${location.pathname}${search}&videoId=${videoId}`);
                }
            });
        }
    }, [navigation, navigate, videoId]);

    useLayoutEffect(() => {
        setIframeSize(screenSize);
    }, [screenSize, setIframeSize, orientation]);


    return <div className="player h-100vh w-100vw">
        <div className="floating-btn text-center" onClick={goBack}>
            <div className="text-center icon i-back">&larr;</div>
            <div className="text-center">Back</div>
        </div>
        <iframe
            ref={iframeRef}
            title={searchParams.get("title") || "A Youtube Video"}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            style={{
                overflow: "hidden",
                height: screenSize[1],
                width: screenSize[0],
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="slide-from-clear"
        />
    </div>
}
