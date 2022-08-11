export interface Db {
    /**
     * Retrieves an object saved in the store
     * @param id - the id of the object saved in the store
     */
    get(id: string): Promise<{ [key: string]: any } | null>;

    /**
     * Saves the given object in the store
     * @param id - the id of the object to be used to retrieve it later
     * @param obj - the object to saved
     */
    set(id: string, obj: { [key: string]: any }): Promise<void>;

    /**
     * Clears the storage
     */
    clear(): Promise<void>;
}

/**
 * LocalStorageDb stores data in localStorage
 */
export class LocalStorageDb implements Db {
    private instance: LocalForage;

    constructor(instance: LocalForage) {
        this.instance = instance;
    }

    async get(id: string): Promise<{ [key: string]: any; } | null> {
        return this.instance.getItem(id);
    }
    async set(id: string, obj: { [key: string]: any; }): Promise<void> {
        await this.instance.setItem(id, obj);
    }

    async clear(): Promise<void> {
        await this.instance.clear();
    }
}

/**
 * SessionStorageDb stores data in sessionStorage
 * Thus the data will disappear when a new session is started
 */
export class SessionStorageDb extends LocalStorageDb {
    constructor(instance: LocalForage) {
        super(instance);
        this.clear().then(() => { }).catch(console.error);
    }
}

/**
 * DummyDb stores data in memory
 */
export class DummyDb implements Db {
    private _data: { [key: string]: any } = {};

    async get(id: string): Promise<{ [key: string]: any; } | null> {
        return this._data[id];
    }
    async set(id: string, obj: { [key: string]: any; }): Promise<void> {
        this._data[id] = obj;
    }

    async clear(): Promise<void> {
        for (const key in this._data) {
            if (Object.prototype.hasOwnProperty.call(this._data, key)) {
                delete this._data[key];
            }
        }
    }
}
