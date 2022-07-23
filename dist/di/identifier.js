import { _identifiers } from '../di/store.js';
import { storeDependency } from '../di/dependency.js';
export function createIdentifier(key) {
    if (_identifiers.has(key)) {
        return _identifiers.get(key);
    }
    const id = function (target, _, index) {
        if (arguments.length !== 3) {
            throw 'Identifier can only be used as a decorator in a class constructor';
        }
        storeDependency(target, index, key);
    };
    id._key = key;
    _identifiers.set(key, id);
    return id;
}
