import { Db } from "./db";
import { Channel, PlaylistItem } from "./types/dtos";

/**
 * The Store that holds the channels and the playlist items
 */
export class Store {
    channels: { [key: string]: Channel } = {};
    playlistItems: { [key: string]: PlaylistItem } = {};
    private dbId = "main.Store";
    private db: Db;
    isLoading: boolean = false;

    constructor({ db }: { db: Db }) {
        this.db = db;
        this.isLoading = true;
        this.loadFromDb()
            .then(() => { })
            .catch(console.error)
            .finally(() => this.isLoading = false);
    }

    /**
     * Handles the cleaning upp just before the Store is released to no longer be of use
     */
    destroy() {
        this.saveToDb().then(() => { }).catch(console.error);
    }

    /**
     * Adds a list of channels to the store and updates the session storage
     * @param channels
     */
    addChannels(channels: Channel[]) {
        for (let channel of channels) {
            this.channels[channel.id] = channel;
        }
        this.saveToDb().then(() => { }).catch(console.error);
    }

    /**
     * Adds a list of playlist items to the store and updates the session storage
     * @param playlistItems
     */
    addPlaylistItems(playlistItems: PlaylistItem[]) {
        for (let playlistItem of playlistItems) {
            this.playlistItems[playlistItem.id] = playlistItem;
        }
        this.saveToDb().then(() => { }).catch(console.error);
    }

    /**
     * Clears the state of the store
     * This is useful when testing thus the presence of the "_" prefix
     */
    async _clearState() {
        for (const key in this.channels) {
            if (Object.prototype.hasOwnProperty.call(this.channels, key)) {
                delete this.channels[key];
            }
        }

        for (const key in this.playlistItems) {
            if (Object.prototype.hasOwnProperty.call(this.playlistItems, key)) {
                delete this.playlistItems[key];
            }
        }

        await this.db.clear();
    }

    /**
     * Loads its attributes from the database
     */
    private async loadFromDb() {
        const { channels = {}, playlistItems = {} } = await this.db.get(this.dbId) || {};
        this.channels = channels;
        this.playlistItems = playlistItems;
    }

    /**
     * Dumps the client into the database
     */
    private async saveToDb() {
        await this.db.set(this.dbId, { channels: this.channels, playlistItems: this.playlistItems });
    }
}