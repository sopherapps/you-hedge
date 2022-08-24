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

    function TestApp() {
        const [channels, setChannels] = useState(firstBatchChannels);
        const mockRefreshChannelFn = () => {
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

    const scrollviewSidebarElement = screen.getByTestId("sidebar-scrollview");
    for (const channel of firstBatchChannelList) {
        const channelElement = within(scrollviewSidebarElement).queryByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    for (const channel of lastBatchChannelList) {
        const channelElement = within(scrollviewSidebarElement).queryByText(channel.title);
        expect(channelElement).not.toBeInTheDocument();
    }

    fireEvent.wheel(scrollviewSidebarElement, { deltaY: 100 });

    for (const channel of firstBatchChannelList) {
        const channelElement = await within(scrollviewSidebarElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    for (const channel of lastBatchChannelList) {
        const channelElement = await within(scrollviewSidebarElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
});

test("swiping down in sidebar loads more channels", async () => {
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();
    const playlistItems = {};
    const firstBatchChannelList = mockPageTokenChannelStructs.map(v => v.channel).filter(chan => !chan.pageToken);
    const lastBatchChannelList = mockPageTokenChannelStructs.map(v => v.channel).filter(chan => !!chan.pageToken);
    const firstBatchChannels = Object.fromEntries(firstBatchChannelList.map(channel => ([channel.id, channel])));
    const lastBatchChannels = Object.fromEntries(lastBatchChannelList.map(channel => ([channel.id, channel])));

    function TestApp() {
        const [channels, setChannels] = useState(firstBatchChannels);
        const mockRefreshChannelFn = () => {
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

    const scrollviewSidebarElement = screen.getByTestId("sidebar-scrollview");
    for (const channel of firstBatchChannelList) {
        const channelElement = within(scrollviewSidebarElement).queryByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    for (const channel of lastBatchChannelList) {
        const channelElement = within(scrollviewSidebarElement).queryByText(channel.title);
        expect(channelElement).not.toBeInTheDocument();
    }

    fireEvent.touchStart(scrollviewSidebarElement, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(scrollviewSidebarElement, { touches: [{ clientX: 0, clientY: 100 }] });
    fireEvent.touchEnd(scrollviewSidebarElement, { touches: [{}] });

    for (const channel of firstBatchChannelList) {
        const channelElement = await within(scrollviewSidebarElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
    for (const channel of lastBatchChannelList) {
        const channelElement = await within(scrollviewSidebarElement).findByText(channel.title);
        expect(channelElement).toBeInTheDocument();
    }
});

test("wheeling down in sidebar when there no more channels does nothing", () => { });

test("swiping down in sidebar when there no more channels does nothing", () => { });

test("wheeling down in the content area loads more playlist items", () => { });

test("swiping down in the content area loads more playlist items", () => { });

test("wheeling down in sidebar when there are no more playlist items does nothing", () => { });

test("swiping down in sidebar when there are no more playlist items does nothing", () => { });

test("clicking the playlist item opens it in the player page", () => { });