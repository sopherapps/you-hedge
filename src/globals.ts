import localforage from "localforage";
import { LocalStorageDb, SessionStorageDb } from "./lib/db";

export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
export const isServiceWorkerEnabled = (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator);
export const localStorageDb = new LocalStorageDb(localforage.createInstance({
    name: "youhedge-local-storage",
    storeName: "localStorage",
}));
export const sessionStorageDb = new SessionStorageDb(localforage.createInstance({
    name: "youhedge-session-storage",
    storeName: "sessionStorage",
}));

