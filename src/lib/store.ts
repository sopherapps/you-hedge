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

    constructor({ db }: { db: Db }) {
        this.db = db;
        this.loadFromDb().then(() => { }).catch(console.error);
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