import { _deps, valideDependencies } from '../di/dependency.js';
import { createIdentifier } from '../di/identifier.js';
function _gatherDeps(service) {
    const dep = _deps.get(service);
    if (!dep) {
        return null;
    }
    return dep;
}
const _store = new Map();
export const IInstantiationService = createIdentifier('builtin-InstantiationService');
export class InstantiationService {
    _collection;
    constructor(collection) {
        this._collection = collection;
    }
    getCollection() {
        return new Proxy(this._collection, {
            set() {
                return false;
            },
            get(t, p) {
                return t[p];
            }
        });
    }
    _getOrCreateServiceByKey(key, args = []) {
        if (!this._collection.has(key)) {
            return null;
        }
        const desc = this._collection.get(key);
        if (!desc) {
            return null;
        }
        const { ctor, singleton, staticArguments } = desc;
        if (singleton && _store.has(key)) {
            return _store.get(key);
        }
        const _service = this._createInstance(ctor, args.length ? args : staticArguments);
        if (singleton) {
            _store.set(key, _service);
        }
        return _service;
    }
    _createInstance(service, args = []) {
        try {
            valideDependencies(service, this._collection);
        }
        catch (err) {
            this.onError.call(this, err);
        }
        let deps = _gatherDeps(service)?.get().map(key => this._getOrCreateServiceByKey(key));
        if (!deps) {
            deps = [];
        }
        return Reflect.construct(service, [...deps, ...args]);
    }
    createInstance(service, args = []) {
        return this._createInstance(service, args);
    }
    invoke(func) {
        const self = this;
        Reflect.apply(func, undefined, [{
                get(k, args = []) {
                    return self._getOrCreateServiceByKey(k, args);
                }
            }]);
    }
    /**
     * @override
     */
    onError(err) {
        console.error(err);
    }
    register(id, service, args = []) {
        this._collection.set(id, service, args);
        return this;
    }
    registerSingleton(id, service, args = []) {
        this._collection.setSingleton(id, service, args);
        return this;
    }
}
