class DummyLocalForageDriver implements LocalForageDriver {
    _driver: string = "test";
    _data: { [key: string]: any } = {};
    _initStorage(options: LocalForageOptions): void {
    }
    _support?: boolean | LocalForageDriverSupportFunc | undefined = true;
    async getItem<T>(key: string, callback?: ((err: any, value: T | null) => void) | undefined): Promise<T | null> {
        return this._data[key] || null;
    }
    async setItem<T>(key: string, value: T, callback?: ((err: any, value: T) => void) | undefined): Promise<T> {
        this._data[key] = value;
        return value;
    }
    async removeItem(key: string, callback?: ((err: any) => void) | undefined): Promise<void> {
        delete this._data[key];
    }
    async clear(callback?: ((err: any) => void) | undefined): Promise<void> {
        for (const key in this._data) {
            if (Object.prototype.hasOwnProperty.call(this._data, key)) {
                delete this._data[key];
            }
        }
    }
    async length(callback?: ((err: any, numberOfKeys: number) => void) | undefined): Promise<number> {
        return Object.keys(this._data).length;
    }
    async key(keyIndex: number, callback?: ((err: any, key: string) => void) | undefined): Promise<string> {
        return Object.keys(this._data)[keyIndex];
    }
    async keys(callback?: ((err: any, keys: string[]) => void) | undefined): Promise<string[]> {
        return Object.keys(this._data);
    }
    async iterate<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U, callback?: ((err: any, result: U) => void) | undefined): Promise<U> {
        let value: U;
        const keys = Object.keys(this._data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            value = iteratee(this._data[key], key, i);
        }

        // @ts-ignore
        return value;
    }

    dropInstance?: LocalForageDropInstanceFn | undefined;
}

class DummyLocalForageSerializer implements LocalForageSerializer {
    serialize<T>(value: Blob | ArrayBuffer | T, callback: (value: string, error: any) => void): void {
        callback(JSON.stringify(value), undefined);
    }
    deserialize<T>(value: string): Blob | ArrayBuffer | T {
        return JSON.parse(value);
    }
    stringToBuffer(serializedString: string): ArrayBuffer {
        const strLength = serializedString.length;
        const buf = new ArrayBuffer(strLength * 2);
        const bufView = new Uint16Array(buf);
        for (let i = 0; i < strLength; i++) {
            bufView[i] = serializedString.charCodeAt(i);
        }
        return buf;
    }
    bufferToString(buffer: ArrayBuffer): string {
        // @ts-ignore
        return String.fromCharCode.apply(null, new Uint16Array(buffer));
    }
}

export class MockLocalForage implements LocalForage {
    LOCALSTORAGE: string = "localstorage";
    WEBSQL: string = "websql";
    INDEXEDDB: string = "indexdb";
    private _driver: LocalForageDriver = new DummyLocalForageDriver();
    private _serializer = new DummyLocalForageSerializer();
    config(options: LocalForageOptions): boolean;
    config(options: string): any;
    config(): LocalForageOptions;
    config(options?: unknown): any {
        throw new Error("Method not implemented.");
    }
    createInstance(options: LocalForageOptions): LocalForage {
        return new MockLocalForage();
    }
    driver(): string {
        return "test";
    }
    async setDriver(driver: string | string[], callback?: (() => void) | undefined, errorCallback?: ((error: any) => void) | undefined): Promise<void> {

    }
    async defineDriver(driver: LocalForageDriver, callback?: (() => void) | undefined, errorCallback?: ((error: any) => void) | undefined): Promise<void> {
    }
    async getDriver(driver: string): Promise<LocalForageDriver> {
        return this._driver;
    }
    async getSerializer(callback?: ((serializer: LocalForageSerializer) => void) | undefined): Promise<LocalForageSerializer> {
        return this._serializer;
    }
    supports(driverName: string): boolean {
        return true;
    }
    async ready(callback?: ((error: any) => void) | undefined): Promise<void> {
    }
    getItem<T>(key: string, callback?: ((err: any, value: T | null) => void) | undefined): Promise<T | null> {
        return this._driver.getItem(key, callback);
    }
    setItem<T>(key: string, value: T, callback?: ((err: any, value: T) => void) | undefined): Promise<T> {
        return this._driver.setItem(key, value, callback);
    }
    removeItem(key: string, callback?: ((err: any) => void) | undefined): Promise<void> {
        return this._driver.removeItem(key, callback);
    }
    clear(callback?: ((err: any) => void) | undefined): Promise<void> {
        return this._driver.clear(callback);
    }
    length(callback?: ((err: any, numberOfKeys: number) => void) | undefined): Promise<number> {
        return this._driver.length(callback);
    }
    key(keyIndex: number, callback?: ((err: any, key: string) => void) | undefined): Promise<string> {
        return this.key(keyIndex, callback);
    }
    keys(callback?: ((err: any, keys: string[]) => void) | undefined): Promise<string[]> {
        return this.keys(callback);
    }
    iterate<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U, callback?: ((err: any, result: U) => void) | undefined): Promise<U> {
        return this.iterate(iteratee, callback);
    }
    async dropInstance(dbInstanceOptions?: LocalForageDbInstanceOptions, callback?: (err: any) => void): Promise<void> {

    }

}
