import { Channel, PlaylistItem } from "./types/dtos";

/**
 * The Store that holds the channels and the playlist items
 */
export class Store {
    channels: { [key: string]: Channel } = {};
    playlistItems: { [key: string]: PlaylistItem } = {};
    sessionStorageKey = "main.Store";

    constructor() {
        this.loadFromSessionStorage();
    }

    /**
     * Handles the cleaning upp just before the Store is released to no longer be of use
     */
    destroy() {
        this.dumpToSessionStorage();
    }

    /**
     * Adds a list of channels to the store and updates the session storage
     * @param channels
     */
    addChannels(channels: Channel[]) {
        for (let channel of channels) {
            this.channels[channel.id] = channel;
        }
        this.dumpToSessionStorage();
    }

    /**
     * Adds a list of playlist items to the store and updates the session storage
     * @param playlistItems
     */
    addPlaylistItems(playlistItems: PlaylistItem[]) {
        for (let playlistItem of playlistItems) {
            this.playlistItems[playlistItem.id] = playlistItem;
        }
        this.dumpToSessionStorage();
    }

    /**
     * Loads its attributes from the session storage
     */
    private loadFromSessionStorage() {
        const dataString = window.sessionStorage.getItem(this.sessionStorageKey) || "{}";
        const { channels = {}, playlistItems = {} } = JSON.parse(dataString);

        this.channels = channels;
        this.playlistItems = playlistItems;
    }

    /**
     * Dumps the client into the SessionStorage
     */
    private dumpToSessionStorage() {
        window.sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(
            { channels: this.channels, playlistItems: this.playlistItems }
        ));
    }
}