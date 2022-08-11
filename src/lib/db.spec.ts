import { MockLocalForage } from "../mocks/localforage";
import { SessionStorageDb, LocalStorageDb, MemoryDb } from "./db";

const forageInstance = new MockLocalForage();
const sampleData: { [key: string]: { [key: string]: any } } = {
    foo: { bar: 8, hello: "world" },
    bar: { bar: 6, hello: "bonjour" },
    hen: { bar: 53, hello: "oi" },
    cow: { bar: 8, hello: "salut" },
}

beforeEach(async () => {
    await forageInstance.clear();
});

test("LocalStorageDb: persists permanently", async () => {
    const key = "foo", value = { "bar": 9 };
    let db = new LocalStorageDb(forageInstance);
    await db.set(key, value);
    const valueBeforeReinitialization = await db.get(key);

    db = new LocalStorageDb(forageInstance);
    const valueAfterReinitialization = await db.get(key);

    expect(valueBeforeReinitialization).toEqual(expect.objectContaining(value));
    expect(valueAfterReinitialization).toEqual(expect.objectContaining(value));
}, 3000);

test("LocalStorageDb: set adds key-value pair in db, get retrieves them", async () => {
    let db = new LocalStorageDb(forageInstance);

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const element = sampleData[key];
            await db.set(key, element);
        }
    }

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const element = sampleData[key];
            const value = await db.get(key);
            expect(value).toEqual(expect.objectContaining(element));
        }
    }
}, 3000);

test("LocalStorageDb: clear removes all keys", async () => {
    let db = new LocalStorageDb(forageInstance);

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const element = sampleData[key];
            await db.set(key, element);
        }
    }

    await db.clear();

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const value = await db.get(key);
            expect(value).toBe(null);
        }
    }

}, 3000);

test("SessionStorageDb: persists only till next instantiation", async () => {
    const key = "foo", value = { "bar": 9 };
    let db = new SessionStorageDb(forageInstance);
    await db.set(key, value);
    const valueBeforeReinitialization = await db.get(key);

    db = new SessionStorageDb(forageInstance);
    const valueAfterReinitialization = await db.get(key);

    expect(valueBeforeReinitialization).toEqual(expect.objectContaining(value));
    expect(valueAfterReinitialization).toEqual(null);
}, 3000);

test("SessionStorageDb: set adds key-value pair in db, get retrieves them", async () => {
    let db = new SessionStorageDb(forageInstance);

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const element = sampleData[key];
            await db.set(key, element);
        }
    }

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const element = sampleData[key];
            const value = await db.get(key);
            expect(value).toEqual(expect.objectContaining(element));
        }
    }
}, 3000);

test("SessionStorageDb: clear removes all keys", async () => {
    let db = new SessionStorageDb(forageInstance);

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const element = sampleData[key];
            await db.set(key, element);
        }
    }

    await db.clear();

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const value = await db.get(key);
            expect(value).toBe(null);
        }
    }

}, 3000);

test("MemoryDb: persists data in memory so it disappears on reinitialization", async () => {
    const key = "foo", value = { "bar": 9 };
    let db = new MemoryDb();
    await db.set(key, value);
    const valueBeforeReinitialization = await db.get(key);

    db = new MemoryDb();
    const valueAfterReinitialization = await db.get(key);

    expect(valueBeforeReinitialization).toEqual(expect.objectContaining(value));
    expect(valueAfterReinitialization).toEqual(null);
}, 3000);

test("MemoryDb: set adds key-value pair in db, get retrieves them", async () => {
    let db = new MemoryDb();

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const element = sampleData[key];
            await db.set(key, element);
        }
    }

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const element = sampleData[key];
            const value = await db.get(key);
            expect(value).toEqual(expect.objectContaining(element));
        }
    }
}, 3000);

test("MemoryDb: clear removes all keys", async () => {
    let db = new MemoryDb();

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const element = sampleData[key];
            await db.set(key, element);
        }
    }

    await db.clear();

    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const value = await db.get(key);
            expect(value).toBe(null);
        }
    }

}, 3000);