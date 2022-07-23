export class Dependency {
    _deps = [];
    set(index, serviceKey) {
        this._deps[index] = serviceKey;
    }
    get() {
        return this._deps;
    }
}
export const _deps = new Map();
export function storeDependency(target, index, key) {
    let dep = _deps.get(target);
    if (!dep) {
        dep = new Dependency();
    }
    dep.set(index, key);
    _deps.set(target, dep);
}
export function valideDependencies(target, col, exists = [], check) {
    const deps = _deps.get(target);
    if (!check) {
        check = target;
    }
    if (!deps) {
        return true;
    }
    for (const dep of deps.get()) {
        const desc = col.get(dep);
        if (!desc) {
            throw ReferenceError('No corresponding target found in collection');
        }
        if (exists.includes(check)) {
            exists = exists.map(c => c.name);
            throw new CircularDependencyError(exists);
        }
        exists.push(desc.ctor);
        valideDependencies(desc.ctor, col, exists, check);
    }
    return true;
}
class CircularDependencyError extends Error {
    constructor(arr) {
        super(`Find circular dependencies: ${arr.join(', ')}`);
    }
}
