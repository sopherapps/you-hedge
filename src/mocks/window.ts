// We are going to use window as a ServiceWorkerGlobalScope. The declaration here
// is to make typescript happy, for lack of a better word
declare global {
    interface Window extends ServiceWorkerGlobalScope {
        swSelf: ServiceWorkerGlobalScope
    }

    interface WindowEventMap extends ServiceWorkerGlobalScopeEventMap { }
}

// Changing the postMessage of window to require only one argument instead of two
// This is the same followed when postMessaging in serviceWroker communication
window.postMessage = function (data: any) {
    window.dispatchEvent(new CustomEvent("post", { detail: { data, source: this } }));
}

// Since postMessage is handled by "message" event handlers,
// the customization below is to be able to handle them with the expected payload
// for some reason MessageEvent instances were not being captured so I used CustomEvents
// and put the data, source in the CustomEvent.detail prop. I needed to remove it again
// for the sake of the callbacks defined in code that expect event to be of MessageEvent type
const originalAddEventListener = window.addEventListener;
// @ts-ignore
window.addEventListener = function (name: any, callback: (ev: any) => void) {
    let type = name;
    let handler = callback;
    if (name === "message") {
        type = "post";
        handler = ev => {
            // @ts-ignore
            callback({ ...ev.detail });
        };
    }

    originalAddEventListener(type, handler);
}

// Mocking serviceWorker for tests
Object.defineProperty(global.navigator, 'serviceWorker', {
    value: {
        register: async (url: string, { self }: { self: any }) => {
            window.swSelf = self;
            // @ts-ignore
            window.swSelf.registration = {
                active: {
                    // @ts-ignore
                    postMessage: window.swSelf.postMessage
                },
            };
            return window.swSelf.registration;
        },
        addEventListener: window.addEventListener,
        get ready(): Promise<ServiceWorkerRegistration> {
            return (async () => window.swSelf?.registration)();
        }
    }
});

// Just to make typescript happy because it wants modules
export { }