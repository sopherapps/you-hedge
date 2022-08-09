import { YoutubeClient } from "./lib/client/youtube";
import { LocalStorageDb, SessionStorageDb } from "./lib/db";
import { Store } from "./lib/store";

export const youtubeClient = new YoutubeClient({ db: new LocalStorageDb() });
export const store = new Store({ db: new SessionStorageDb() });