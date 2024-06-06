var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { IRenderer } from '../engine/Renderer.js';
import { createIdentifier } from '../di/index.js';
import { Ray, Vector } from '../engine/types.js';
import { IInput } from '../engine/Input.js';
export const IGameLoop = createIdentifier('game-loop');
function vsync(handler) {
    if (typeof handler !== 'function') {
        throw 'handler should be type of function';
    }
    let timeStamp;
    let loopid;
    const onFrameFresh = (ts) => {
        if (!timeStamp) {
            timeStamp = ts;
            loopid = requestAnimationFrame(onFrameFresh);
        }
        const dt = ts - timeStamp;
        timeStamp = ts;
        handler.call(undefined, dt, ts);
        loopid = requestAnimationFrame(onFrameFresh);
    };
    requestAnimationFrame(onFrameFresh);
    return {
        cancel: () => {
            cancelAnimationFrame(loopid);
        }
    };
}
let GameLoop = class GameLoop {
    renderer;
    input;
    constructor(renderer, input) {
        this.renderer = renderer;
        this.input = input;
    }
    renderOpt;
    speed = 0.5;
    loadScene() {
    }
    startLoop() {
        this.input.init();
        const renderer = this.renderer;
        const texture = new Image();
        texture.src = './texture.jpg';
        this.renderOpt = {
            light: '#fff',
            sky: 'gray',
            ground: '#aba',
            view: new Ray(0, 0, 0, 100),
            surfaces: [
                {
                    x: -3,
                    y: 1,
                    dx: 6,
                    dy: 1,
                    // backgroundColor: 'blue',
                    source: texture,
                },
                {
                    x: 4,
                    y: 1,
                    dx: 2,
                    dy: -2,
                    backgroundColor: 'yellow'
                },
                {
                    x: -4,
                    y: 1,
                    dx: 0,
                    dy: -2,
                    backgroundColor: 'teal',
                    source: '',
                    clip: [0, 0]
                },
            ]
        };
        const keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            mh: 0,
            pause: false,
        };
        window.addEventListener('keydown', ev => {
            if (ev.key === 'w') {
                keys.w = true;
            }
            if (ev.key === 's') {
                keys.s = true;
            }
            if (ev.key === 'a') {
                keys.a = true;
            }
            if (ev.key === 'd') {
                keys.d = true;
            }
        });
        window.addEventListener('keyup', ev => {
            if (ev.key === 'w') {
                keys.w = false;
            }
            if (ev.key === 's') {
                keys.s = false;
            }
            if (ev.key === 'a') {
                keys.a = false;
            }
            if (ev.key === 'd') {
                keys.d = false;
            }
            if (ev.key === 'Escape') {
                keys.pause = !keys.pause;
                if (keys.pause) {
                    this.renderer.pauseRenderLoop();
                }
                else {
                    this.renderer.startRenderLoop();
                }
            }
        });
        window.addEventListener('mousemove', ev => {
            keys.mh -= ev.movementX * 0.0015;
        });
        window.addEventListener('mousedown', () => {
            document.body.requestPointerLock();
        });
        renderer.setRenderOpt(this.renderOpt);
        const v = this.renderOpt.view;
        // const loop = () => setTimeout(() => {
        //     if (keys.w) {
        //         v.move(Vector.muilti(v, 0.0005))
        //     }
        //     if (keys.s) {
        //         v.move(Vector.muilti(v, -0.0005))
        //     }
        //     if (keys.a) {
        //         v.move(Vector.rotate(Vector.muilti(v, 0.0005), 1.57))
        //     }
        //     if (keys.d) {
        //         v.move(Vector.rotate(Vector.muilti(v, -0.0005), 1.57))
        //     }
        //     const {dx, dy} = Vector.rotate(v, keys.mh)
        //     v.dx = dx
        //     v.dy = dy
        //     keys.mh = 0
        //     // console.log(renderOpt.view)
        //     loop()
        // }, 16.6666666)
        renderer.startRenderLoop();
        this.startRenderLoop();
        // loop()
    }
    startRenderLoop() {
        const v = this.renderOpt.view;
        vsync((dt) => {
            if (!dt) {
                return;
            }
            const dm = 0.0001 * this.speed * dt;
            if (this.input.w) {
                v.move(Vector.muilti(v, dm));
            }
            if (this.input.s) {
                v.move(Vector.muilti(v, -dm));
            }
            if (this.input.a) {
                v.move(Vector.rotate(Vector.muilti(v, dm), 1.57));
            }
            if (this.input.d) {
                v.move(Vector.rotate(Vector.muilti(v, -dm), 1.57));
            }
            const { dx, dy } = Vector.rotate(v, this.input.mouse.mh);
            v.dx = dx;
            v.dy = dy;
            this.input.mouse.mh = 0;
        });
    }
};
GameLoop = __decorate([
    __param(0, IRenderer),
    __param(1, IInput)
], GameLoop);
export { GameLoop };
