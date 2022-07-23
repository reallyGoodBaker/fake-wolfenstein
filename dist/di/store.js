function createDescriptor(service, singleton = true, staticArgs = []) {
    const desc = {
        ctor: service,
        singleton,
        staticArguments: staticArgs
    };
    return desc;
}
export const _identifiers = new Map();
export class ServiceCollection {
    _entries = new Map();
    constructor(singletonOpt, basicOpt) {
        if (Array.isArray(singletonOpt)) {
            for (const _opt of singletonOpt) {
                const [id, ctor, args] = _opt;
                this.setSingleton(id, ctor, args);
            }
        }
        if (Array.isArray(basicOpt)) {
            for (const _opt of basicOpt) {
                const [id, ctor, args] = _opt;
                this.set(id, ctor, args);
            }
        }
    }
    setSingleton(id, service, args = []) {
        this._entries.set(typeof id === 'string' ? id : id._key, createDescriptor(service, true, args));
        return this;
    }
    set(id, service, args = []) {
        this._entries.set(typeof id === 'string' ? id : id._key, createDescriptor(service, false, args));
        return this;
    }
    get(id) {
        return this._entries.get(typeof id === 'string' ? id : id._key);
    }
    has(id) {
        return this._entries.has(typeof id === 'string' ? id : id._key);
    }
}
