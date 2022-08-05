import debounce from "lodash.debounce";
import { useCallback, WheelEvent, useEffect, useMemo, useRef } from "react";
import { SwipeEventData, useSwipeable } from "react-swipeable";

export interface YScrollData {
    isUp: boolean;
    isDown: boolean;
    isAtBottom: boolean;
}

interface IProps {
    children: any;
    className: string;
    height: string;
    width: string;
    onScroll: (e: YScrollData) => void;
    scrollTop?: number;
}

export default function YScrollView({ children, className, onScroll, height, width, scrollTop = 0 }: IProps) {
    const el = useRef<HTMLDivElement>(null);

    const isAtBottom = useCallback(() => {
        const scrollView = el.current;
        if (scrollView) {
            const scrollPosition = Math.abs(scrollView.scrollHeight - scrollView.scrollTop - scrollView.clientHeight);
            return scrollPosition <= 50;
        }
        return false;
    }, [el]);

    const wrappedOnScroll = useCallback((ev: WheelEvent | SwipeEventData) => {
        // @ts-ignore
        const isDown = (ev?.dir === "Up" || ev.deltaY > 0);
        return onScroll({ isUp: !isDown, isDown, isAtBottom: isAtBottom() });
    }, [isAtBottom, onScroll]);

    const debouncedOnScroll = useMemo(
        () => debounce(wrappedOnScroll, 300), [wrappedOnScroll]);
    const onSwipeHandlers = useSwipeable({
        onSwipedUp: wrappedOnScroll,
        onSwipedDown: wrappedOnScroll,
    });

    /**
     * Effects
     */
    useEffect(() => {
        return () => {
            // clean up any pending debounced call
            debouncedOnScroll.cancel();
        };
    }, [debouncedOnScroll]);

    useEffect(() => {
        console.log({ scrollTop });
        el.current?.scrollTo({ behavior: "smooth", top: scrollTop });
    }, [scrollTop]);

    return (
        <div onWheel={debouncedOnScroll} {...onSwipeHandlers} style={{ height, width }}>
            <div ref={el} className={className} style={{ overflowY: "scroll", overflowX: "hidden", height: "100%", width: "100%" }}>
                {children}
            </div>
        </div>
    )
}