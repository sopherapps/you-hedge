import { MockLocalForage } from "../mocks/localforage";
import { LocalStorageDb } from "./db";
import { Store } from "./store";
import { Channel, PlaylistItem } from "./types/dtos";

const testDb = new LocalStorageDb(new MockLocalForage());
const store = new Store({ db: testDb });
const playlistItems = [
    {
        id: 'djkaljdsa',
        channelId: 'Gundi',
        position: 0,
        title: 'Yeah',
        description: 'Anhuh',
        imageUrl: 'https://i.ytimg.com/vi/sfkjsfs/dtrg.jpg',
        videoId: 'fdfret',
        pageToken: undefined,
        nextPageToken: undefined,
        timestamp: new Date("2022-08-11T08:05:40.290Z")
    } as PlaylistItem,
    {
        id: 'adderevdv',
        channelId: 'Gundi',
        position: 1,
        title: 'Tarara',
        description: 'Hey world',
        imageUrl: 'https://i.ytimg.com/vi/jsdhs/gstgrgstr.jpg',
        videoId: 'dfssfregr',
        pageToken: undefined,
        nextPageToken: undefined,
        timestamp: new Date("2022-08-11T08:05:40.290Z")
    } as PlaylistItem
];
const channels = [
    {
        id: 'iuiuoaiuh',
        position: 0,
        title: 'Yoooo',
        description: 'Some stuff',
        imageUrl: 'https://yt3.ggpht.com/ytc/ryt',
        playlistId: 'eyuryejhhrje',
        pageToken: undefined,
        nextPageToken: 'yutth',
        timestamp: new Date("2022-08-11T08:00:20.163Z")
    } as Channel,
    {
        id: 'Gundi',
        position: 1,
        title: 'Penicilin',
        description: '',
        imageUrl: 'https://yt3.ggpht.com/ytc/ryt',
        playlistId: 'anotherPlaylistId',
        pageToken: undefined,
        nextPageToken: 'yutth',
        timestamp: new Date("2022-08-11T08:00:20.163Z")
    } as Channel
];

beforeEach(async () => { await store._clearState(); });

test("Store: addChannels adds a list of channels to it", async () => {
    const expectedChannels: { [key: string]: Channel } = {};
    for (const chan of channels) {
        expectedChannels[chan.id] = chan;
    }
    const channelsBeforeAdding = { ...store.channels };
    store.addChannels(channels);

    expect(channelsBeforeAdding).toEqual({});
    expect(store.channels).toEqual(expect.objectContaining(expectedChannels));
}, 3000);

test("Store: addPlaylistItems adds a list of playlistItems to it", async () => {
    const expectedPlaylistItems: { [key: string]: PlaylistItem } = {};
    for (const item of playlistItems) {
        expectedPlaylistItems[item.id] = item;
    }

    const playlistItemsBeforeAdding = { ...store.playlistItems };
    store.addPlaylistItems(playlistItems);

    expect(playlistItemsBeforeAdding).toEqual({});
    expect(store.playlistItems).toEqual(expect.objectContaining(expectedPlaylistItems));
}, 3000);

test("Store: Obtains old data on initialization", (done) => {
    store.addChannels(channels);
    store.addPlaylistItems(playlistItems);

    const newStore = new Store({ db: testDb });
    if (newStore.isLoading) {
        setTimeout(() => {
            expect(newStore.isLoading).toBe(false);
            expect(newStore.channels).toEqual(expect.objectContaining(channels));
            expect(newStore.playlistItems).toEqual(expect.objectContaining(playlistItems));
            done();
        }, 1000);
    } else {
        expect(newStore.channels).toEqual(expect.objectContaining(channels));
        expect(newStore.playlistItems).toEqual(expect.objectContaining(playlistItems));
    }
    done();
}, 4000);