export interface Db {
    /**
     * Retrieves an object saved in the store
     * @param id - the id of the object saved in the store
     */
    get(id: string): { [key: string]: any } | null;

    /**
     * Saves the given object in the store
     * @param id - the id of the object to be used to retrieve it later
     * @param obj - the object to saved
     */
    set(id: string, obj: { [key: string]: any }): void;
}

/**
 * SessionStorageDb stores data in sessionStorage
 * Thus the data will disappear when the session ends
 */
export class SessionStorageDb implements Db {
    get(id: string): { [key: string]: any; } | null {
        const valueAsStr = window.sessionStorage.getItem(id);
        return valueAsStr && JSON.parse(valueAsStr);
    }
    set(id: string, obj: { [key: string]: any; }): void {
        const valueAsStr = JSON.stringify(obj);
        window.sessionStorage.setItem(id, valueAsStr);
    }
}

/**
 * LocalStorageDb stores data in localStorage
 */
export class LocalStorageDb implements Db {
    get(id: string): { [key: string]: any; } | null {
        const valueAsStr = window.localStorage.getItem(id);
        return valueAsStr && JSON.parse(valueAsStr);
    }
    set(id: string, obj: { [key: string]: any; }): void {
        const valueAsStr = JSON.stringify(obj);
        window.localStorage.setItem(id, valueAsStr);
    }
}