import localforage from "localforage";
import * as memoryDriver from "localforage-driver-memory";
import { YoutubeClient } from "./lib/client/youtube";
import { LocalStorageDb, SessionStorageDb } from "./lib/db";
import { Store } from "./lib/store";

declare const self: ServiceWorkerGlobalScope;
// @ts-ignore
var window = this?.window;

const localforageDrivers = [localforage.INDEXEDDB, localforage.LOCALSTORAGE, localforage.WEBSQL, memoryDriver._driver];

export const isServiceWorkerEnabled = (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator);

export const youtubeClient = new YoutubeClient({
    db: new LocalStorageDb(localforage.createInstance({
        name: "youhedge-local-storage",
        storeName: "localStorage",
        driver: localforageDrivers,
    })), parent: isServiceWorkerEnabled ? self : window
});
export const store = new Store({
    db: new SessionStorageDb(localforage.createInstance({
        name: "youhedge-session-storage",
        storeName: "sessionStorage",
        driver: localforageDrivers
    }))
});
