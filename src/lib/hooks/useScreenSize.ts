import { useState, useEffect } from 'react';

export default function useScreenSize() {
    const [size, setSize] = useState<[number, number]>(
        [
            window.document.documentElement.clientWidth,
            window.document.documentElement.clientHeight
        ]
    );

    useEffect(() => {
        const handleScreenResize = () =>
            setSize([
                window.document.documentElement.clientWidth,
                window.document.documentElement.clientHeight,
            ]);

        window.addEventListener('resize', handleScreenResize);
        return () =>
            window.removeEventListener('resize', handleScreenResize);
    }, []);

    return size;
}
