import { fireEvent, screen, within } from "@testing-library/react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ChannelsContext, LoginStatusContext, PlaylistItemsContext } from "../lib/contexts";
import { getMockPageTokenChannelStructs, getMockPlaylistItemsStructs } from "../mocks/dtos";
import { render } from "../mocks/router";
import HomePage from "./home.page";


test("renders channels in sidebar", () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const playlistItems = {};
    const channels = Object.fromEntries(mockPageTokenChannelStructs.map(({ channel }) => ([channel.id, channel])));
    const channelList = Object.values(channels);

    render(
        (
            <ChannelsContext.Provider value={channels}>
                <PlaylistItemsContext.Provider value={playlistItems}>
                    <Routes>
                        <Route path="/" element={<HomePage refreshChannelBatch={() => { }} refreshPlaylistItemBatch={() => { }} />} />
                    </Routes>
                </PlaylistItemsContext.Provider>
            </ChannelsContext.Provider>
        ),
        { routesReplay: [`/`] }
    );

    const sidebarElement = screen.getByTestId("sidebar");
    for (const channel of channelList) {
        const channelElement = within(sidebarElement).getByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
});

test("renders playlist items for selected channel in content area", () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const mockPlaylistItemsStructs = getMockPlaylistItemsStructs();

    const channels = Object.fromEntries(mockPageTokenChannelStructs.map(({ channel }) => ([channel.id, channel])));
    const playlistItems = Object.fromEntries(mockPlaylistItemsStructs
        .map(item => item.playlist.items)
        .reduce((prev, curr) => prev.concat(curr))
        .map(item => [item.id, item]));
    const channelList = Object.values(channels);
    const selectedChannelId = channelList[1].id;
    const playlistItemsList = Object.values(playlistItems).filter(item => item.channelId === selectedChannelId);

    render(
        (
            <ChannelsContext.Provider value={channels}>
                <PlaylistItemsContext.Provider value={playlistItems}>
                    <Routes>
                        <Route path="/" element={<HomePage refreshChannelBatch={() => { }} refreshPlaylistItemBatch={() => { }} />} />
                    </Routes>
                </PlaylistItemsContext.Provider>
            </ChannelsContext.Provider>
        ),
        { routesReplay: [`/?channelId=${selectedChannelId}`] }
    );

    const contentAreaElement = screen.getByTestId("content-area");
    for (const playlistItem of playlistItemsList) {
        const title = `${playlistItem.title.slice(0, 60).trimEnd()}${playlistItem.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = within(contentAreaElement).getByText(title);
        expect(playlistItemElement).toBeInTheDocument();
    }
});

test("wheeling down in sidebar loads more channels", async () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const playlistItems = {};
    const firstBatchChannelList = mockPageTokenChannelStructs.map(v => v.channel).filter(chan => !chan.pageToken);
    const lastBatchChannelList = mockPageTokenChannelStructs.map(v => v.channel).filter(chan => !!chan.pageToken);
    const firstBatchChannels = Object.fromEntries(firstBatchChannelList.map(channel => ([channel.id, channel])));
    const lastBatchChannels = Object.fromEntries(lastBatchChannelList.map(channel => ([channel.id, channel])));
    const mockCallback = jest.fn(() => { });

    function TestApp() {
        const [channels, setChannels] = useState(firstBatchChannels);
        const mockRefreshChannelFn = () => {
            mockCallback();
            setChannels(chans => ({ ...chans, ...lastBatchChannels }));
        };

        return (<ChannelsContext.Provider value={channels}>
            <PlaylistItemsContext.Provider value={playlistItems}>
                <Routes>
                    <Route path="/" element={<HomePage refreshChannelBatch={mockRefreshChannelFn} refreshPlaylistItemBatch={() => { }} />} />
                </Routes>
            </PlaylistItemsContext.Provider>
        </ChannelsContext.Provider>);
    }


    render(<TestApp />, { routesReplay: [`/`] });

    const sidebarScrollviewElement = screen.getByTestId("sidebar-scrollview");
    for (const channel of firstBatchChannelList) {
        const channelElement = within(sidebarScrollviewElement).queryByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    for (const channel of lastBatchChannelList) {
        const channelElement = within(sidebarScrollviewElement).queryByText(channel.title);
        expect(channelElement).not.toBeInTheDocument();
    }

    fireEvent.wheel(sidebarScrollviewElement, { deltaY: 100 });

    for (const channel of firstBatchChannelList) {
        const channelElement = await within(sidebarScrollviewElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    for (const channel of lastBatchChannelList) {
        const channelElement = await within(sidebarScrollviewElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    expect(mockCallback).toBeCalledTimes(1);
});

test("swiping down in sidebar loads more channels", async () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const playlistItems = {};
    const firstBatchChannelList = mockPageTokenChannelStructs.map(v => v.channel).filter(chan => !chan.pageToken);
    const lastBatchChannelList = mockPageTokenChannelStructs.map(v => v.channel).filter(chan => !!chan.pageToken);
    const firstBatchChannels = Object.fromEntries(firstBatchChannelList.map(channel => ([channel.id, channel])));
    const lastBatchChannels = Object.fromEntries(lastBatchChannelList.map(channel => ([channel.id, channel])));
    const mockCallback = jest.fn(() => { });

    function TestApp() {
        const [channels, setChannels] = useState(firstBatchChannels);
        const mockRefreshChannelFn = () => {
            mockCallback();
            setChannels(chans => ({ ...chans, ...lastBatchChannels }));
        };

        return (<ChannelsContext.Provider value={channels}>
            <PlaylistItemsContext.Provider value={playlistItems}>
                <Routes>
                    <Route path="/" element={<HomePage refreshChannelBatch={mockRefreshChannelFn} refreshPlaylistItemBatch={() => { }} />} />
                </Routes>
            </PlaylistItemsContext.Provider>
        </ChannelsContext.Provider>);
    }


    render(<TestApp />, { routesReplay: [`/`] });

    const sidebarScrollviewElement = screen.getByTestId("sidebar-scrollview");
    for (const channel of firstBatchChannelList) {
        const channelElement = within(sidebarScrollviewElement).queryByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    for (const channel of lastBatchChannelList) {
        const channelElement = within(sidebarScrollviewElement).queryByText(channel.title);
        expect(channelElement).not.toBeInTheDocument();
    }

    fireEvent.touchStart(sidebarScrollviewElement, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(sidebarScrollviewElement, { touches: [{ clientX: 0, clientY: 100 }] });
    fireEvent.touchEnd(sidebarScrollviewElement, { touches: [{}] });

    for (const channel of firstBatchChannelList) {
        const channelElement = await within(sidebarScrollviewElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    for (const channel of lastBatchChannelList) {
        const channelElement = await within(sidebarScrollviewElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    expect(mockCallback).toBeCalledTimes(1);
});

test("wheeling down in sidebar when there no more channels does nothing", async () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const playlistItems = {};
    const channelList = mockPageTokenChannelStructs.map(v => v.channel);
    const allChannels = Object.fromEntries(channelList.map(channel => ([channel.id, channel])));
    const mockCallback = jest.fn(() => { });

    function TestApp() {
        const [channels, setChannels] = useState(allChannels);
        const mockRefreshChannelFn = () => {
            mockCallback();
            setChannels(chans => ({ ...chans, ...allChannels }));
        };

        return (<ChannelsContext.Provider value={channels}>
            <PlaylistItemsContext.Provider value={playlistItems}>
                <Routes>
                    <Route path="/" element={<HomePage refreshChannelBatch={mockRefreshChannelFn} refreshPlaylistItemBatch={() => { }} />} />
                </Routes>
            </PlaylistItemsContext.Provider>
        </ChannelsContext.Provider>);
    }


    render(<TestApp />, { routesReplay: [`/`] });

    const sidebarScrollviewElement = screen.getByTestId("sidebar-scrollview");
    fireEvent.wheel(sidebarScrollviewElement, { deltaY: 100 });

    for (const channel of channelList) {
        const channelElement = await within(sidebarScrollviewElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }

    expect(mockCallback).not.toBeCalled();
});

test("swiping down in sidebar when there no more channels does nothing", async () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const playlistItems = {};
    const channelList = mockPageTokenChannelStructs.map(v => v.channel);
    const allChannels = Object.fromEntries(channelList.map(channel => ([channel.id, channel])));
    const mockCallback = jest.fn(() => { });

    function TestApp() {
        const [channels, setChannels] = useState(allChannels);
        const mockRefreshChannelFn = () => {
            mockCallback();
            setChannels(chans => ({ ...chans, ...allChannels }));
        };

        return (<ChannelsContext.Provider value={channels}>
            <PlaylistItemsContext.Provider value={playlistItems}>
                <Routes>
                    <Route path="/" element={<HomePage refreshChannelBatch={mockRefreshChannelFn} refreshPlaylistItemBatch={() => { }} />} />
                </Routes>
            </PlaylistItemsContext.Provider>
        </ChannelsContext.Provider>);
    }


    render(<TestApp />, { routesReplay: [`/`] });

    const sidebarScrollviewElement = screen.getByTestId("sidebar-scrollview");
    fireEvent.touchStart(sidebarScrollviewElement, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(sidebarScrollviewElement, { touches: [{ clientX: 0, clientY: 100 }] });
    fireEvent.touchEnd(sidebarScrollviewElement, { touches: [{}] });

    for (const channel of channelList) {
        const channelElement = await within(sidebarScrollviewElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }

    expect(mockCallback).not.toBeCalled();
});

test("wheeling down in the content area loads more playlist items", async () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const mockPlaylistItemsStructs = getMockPlaylistItemsStructs();
    const channels = Object.fromEntries(mockPageTokenChannelStructs.map(({ channel }) => ([channel.id, channel])));
    const selectedChannelId = "iuiuoaiuh";
    const allPlaylistItems = mockPlaylistItemsStructs
        .map(item => item.playlist.items)
        .reduce((prev, curr) => prev.concat(curr))
        .filter(item => item.channelId === selectedChannelId);

    const firstBatchPlaylistItemList = allPlaylistItems.filter(item => !item.pageToken);
    const lastBatchPlaylistItemList = allPlaylistItems.filter(item => !!item.pageToken);
    const firstBatchPlaylistItems = Object.fromEntries(firstBatchPlaylistItemList.map(item => ([item.id, item])));
    const lastBatchPlaylistItems = Object.fromEntries(lastBatchPlaylistItemList.map(item => ([item.id, item])));
    const mockCallback = jest.fn(() => { });

    function TestApp() {
        const [playlistItems, setPlaylistItems] = useState(firstBatchPlaylistItems);
        const mockRefreshPlaylistItemsFn = () => {
            mockCallback();
            setPlaylistItems(items => ({ ...items, ...lastBatchPlaylistItems }));
        };

        return (<ChannelsContext.Provider value={channels}>
            <PlaylistItemsContext.Provider value={playlistItems}>
                <Routes>
                    <Route path="/" element={<HomePage refreshChannelBatch={() => { }} refreshPlaylistItemBatch={mockRefreshPlaylistItemsFn} />} />
                </Routes>
            </PlaylistItemsContext.Provider>
        </ChannelsContext.Provider>);
    }


    render(<TestApp />, { routesReplay: [`/?channelId=${selectedChannelId}`] });

    const contentAreaScrollviewElement = screen.getByTestId("content-area-scrollview");
    for (const item of firstBatchPlaylistItemList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = within(contentAreaScrollviewElement).queryByText(title);
        expect(playlistItemElement).toBeInTheDocument();
    }
    for (const item of lastBatchPlaylistItemList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = within(contentAreaScrollviewElement).queryByText(title);
        expect(playlistItemElement).not.toBeInTheDocument();
    }

    fireEvent.wheel(contentAreaScrollviewElement, { deltaY: 100 });

    for (const item of firstBatchPlaylistItemList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = await within(contentAreaScrollviewElement).findByText(title);
        expect(playlistItemElement).toBeInTheDocument();
    }
    for (const item of lastBatchPlaylistItemList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = await within(contentAreaScrollviewElement).findByText(title);
        expect(playlistItemElement).toBeInTheDocument();
    }

    expect(mockCallback).toBeCalledTimes(1);
});

test("swiping down in the content area loads more playlist items", async () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const mockPlaylistItemsStructs = getMockPlaylistItemsStructs();
    const channels = Object.fromEntries(mockPageTokenChannelStructs.map(({ channel }) => ([channel.id, channel])));
    const selectedChannelId = "iuiuoaiuh";
    const allPlaylistItems = mockPlaylistItemsStructs
        .map(item => item.playlist.items)
        .reduce((prev, curr) => prev.concat(curr))
        .filter(item => item.channelId === selectedChannelId);

    const firstBatchPlaylistItemList = allPlaylistItems.filter(item => !item.pageToken);
    const lastBatchPlaylistItemList = allPlaylistItems.filter(item => !!item.pageToken);
    const firstBatchPlaylistItems = Object.fromEntries(firstBatchPlaylistItemList.map(item => ([item.id, item])));
    const lastBatchPlaylistItems = Object.fromEntries(lastBatchPlaylistItemList.map(item => ([item.id, item])));
    const mockCallback = jest.fn(() => { });

    function TestApp() {
        const [playlistItems, setPlaylistItems] = useState(firstBatchPlaylistItems);
        const mockRefreshPlaylistItemsFn = () => {
            mockCallback();
            setPlaylistItems(items => ({ ...items, ...lastBatchPlaylistItems }));
        };

        return (<ChannelsContext.Provider value={channels}>
            <PlaylistItemsContext.Provider value={playlistItems}>
                <Routes>
                    <Route path="/" element={<HomePage refreshChannelBatch={() => { }} refreshPlaylistItemBatch={mockRefreshPlaylistItemsFn} />} />
                </Routes>
            </PlaylistItemsContext.Provider>
        </ChannelsContext.Provider>);
    }


    render(<TestApp />, { routesReplay: [`/?channelId=${selectedChannelId}`] });

    const contentAreaScrollviewElement = screen.getByTestId("content-area-scrollview");
    for (const item of firstBatchPlaylistItemList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = within(contentAreaScrollviewElement).queryByText(title);
        expect(playlistItemElement).toBeInTheDocument();
    }
    for (const item of lastBatchPlaylistItemList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = within(contentAreaScrollviewElement).queryByText(title);
        expect(playlistItemElement).not.toBeInTheDocument();
    }

    fireEvent.wheel(contentAreaScrollviewElement, { deltaY: 100 });
    fireEvent.touchStart(contentAreaScrollviewElement, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(contentAreaScrollviewElement, { touches: [{ clientX: 0, clientY: 100 }] });
    fireEvent.touchEnd(contentAreaScrollviewElement, { touches: [{}] });

    for (const item of firstBatchPlaylistItemList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = await within(contentAreaScrollviewElement).findByText(title);
        expect(playlistItemElement).toBeInTheDocument();
    }
    for (const item of lastBatchPlaylistItemList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = await within(contentAreaScrollviewElement).findByText(title);
        expect(playlistItemElement).toBeInTheDocument();
    }

    expect(mockCallback).toBeCalledTimes(1);
});

test("wheeling down in content area when there are no more playlist items does nothing", async () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const mockPlaylistItemsStructs = getMockPlaylistItemsStructs();
    const channels = Object.fromEntries(mockPageTokenChannelStructs.map(({ channel }) => ([channel.id, channel])));
    const selectedChannelId = "iuiuoaiuh";
    const playlistItemsList = mockPlaylistItemsStructs
        .map(item => item.playlist.items)
        .reduce((prev, curr) => prev.concat(curr))
        .filter(item => item.channelId === selectedChannelId);

    const allPlaylistItems = Object.fromEntries(playlistItemsList.map(item => ([item.id, item])));
    const mockCallback = jest.fn(() => { });

    function TestApp() {
        const [playlistItems, setPlaylistItems] = useState(allPlaylistItems);
        const mockRefreshPlaylistItemsFn = () => {
            mockCallback();
            setPlaylistItems(items => ({ ...items, ...allPlaylistItems }));
        };

        return (<ChannelsContext.Provider value={channels}>
            <PlaylistItemsContext.Provider value={playlistItems}>
                <Routes>
                    <Route path="/" element={<HomePage refreshChannelBatch={() => { }} refreshPlaylistItemBatch={mockRefreshPlaylistItemsFn} />} />
                </Routes>
            </PlaylistItemsContext.Provider>
        </ChannelsContext.Provider>);
    }


    render(<TestApp />, { routesReplay: [`/?channelId=${selectedChannelId}`] });

    const contentAreaScrollviewElement = screen.getByTestId("content-area-scrollview");
    fireEvent.wheel(contentAreaScrollviewElement, { deltaY: 100 });

    for (const item of playlistItemsList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = await within(contentAreaScrollviewElement).findByText(title);
        expect(playlistItemElement).toBeInTheDocument();
    }

    expect(mockCallback).not.toBeCalled();
});

test("swiping down in content area when there are no more playlist items does nothing", async () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const mockPlaylistItemsStructs = getMockPlaylistItemsStructs();
    const channels = Object.fromEntries(mockPageTokenChannelStructs.map(({ channel }) => ([channel.id, channel])));
    const selectedChannelId = "iuiuoaiuh";
    const playlistItemsList = mockPlaylistItemsStructs
        .map(item => item.playlist.items)
        .reduce((prev, curr) => prev.concat(curr))
        .filter(item => item.channelId === selectedChannelId);

    const allPlaylistItems = Object.fromEntries(playlistItemsList.map(item => ([item.id, item])));
    const mockCallback = jest.fn(() => { });

    function TestApp() {
        const [playlistItems, setPlaylistItems] = useState(allPlaylistItems);
        const mockRefreshPlaylistItemsFn = () => {
            mockCallback();
            setPlaylistItems(items => ({ ...items, ...allPlaylistItems }));
        };

        return (<ChannelsContext.Provider value={channels}>
            <PlaylistItemsContext.Provider value={playlistItems}>
                <Routes>
                    <Route path="/" element={<HomePage refreshChannelBatch={() => { }} refreshPlaylistItemBatch={mockRefreshPlaylistItemsFn} />} />
                </Routes>
            </PlaylistItemsContext.Provider>
        </ChannelsContext.Provider>);
    }


    render(<TestApp />, { routesReplay: [`/?channelId=${selectedChannelId}`] });

    const contentAreaScrollviewElement = screen.getByTestId("content-area-scrollview");
    fireEvent.touchStart(contentAreaScrollviewElement, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(contentAreaScrollviewElement, { touches: [{ clientX: 0, clientY: 100 }] });
    fireEvent.touchEnd(contentAreaScrollviewElement, { touches: [{}] });

    for (const item of playlistItemsList) {
        const title = `${item.title.slice(0, 60).trimEnd()}${item.title.length > 60 ? "..." : ""}`;
        const playlistItemElement = await within(contentAreaScrollviewElement).findByText(title);
        expect(playlistItemElement).toBeInTheDocument();
    }

    expect(mockCallback).not.toBeCalled();
});

test("clicking the playlist item opens it in the player page", () => { });