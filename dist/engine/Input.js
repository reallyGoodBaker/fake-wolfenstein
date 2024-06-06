import { createIdentifier } from '../di/identifier.js';
export const IInput = createIdentifier('input');
const keyMap = {
    KeyW: 'w',
    KeyA: 'a',
    KeyS: 's',
    KeyD: 'd',
    ShiftLeft: 'shift',
    ControlLeft: 'ctrl',
};
export class Input {
    mouse = {
        mh: 0
    };
    w = false;
    a = false;
    s = false;
    d = false;
    shift = false;
    ctrl = false;
    init() {
        window.addEventListener('keydown', ev => {
            const key = keyMap[ev.code];
            if (!key) {
                return;
            }
            this[key] = true;
        });
        window.addEventListener('keyup', ev => {
            const key = keyMap[ev.code];
            if (!key) {
                return;
            }
            this[key] = false;
        });
        window.addEventListener('mousemove', ev => {
            this.mouse.mh -= ev.movementX * 0.0015;
        });
    }
    suspend() {
    }
    resume() {
    }
}
