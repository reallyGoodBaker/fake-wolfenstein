var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { createIdentifier } from '../di/index.js';
import { Vector } from '../engine/types.js';
import { IInput } from '../engine/Input.js';
export const IRenderer = createIdentifier('renderer');
let Renderer = class Renderer {
    input;
    _ctx;
    _opt;
    _rendering = false;
    _fov = 75;
    constructor(input) {
        this.input = input;
    }
    setRenderOpt(opt) {
        this._opt = opt;
    }
    setRenderScale(ratio) {
        this._ctx?.scale(ratio, ratio);
    }
    render = () => {
        let doShowFps = true;
        let frame = 0;
        let fps = 0;
        if (!this._ctx || !this._opt) {
            return;
        }
        if (this._rendering) {
            this._doRender();
        }
        if (doShowFps) {
            fps = frame;
            frame = 0;
            doShowFps = false;
        }
        const ctx = this._ctx;
        ctx.save();
        ctx.fillStyle = 'red';
        ctx.font = '20px sans-serif';
        ctx.fillText(fps + '', 0, 20);
        ctx.restore();
        frame++;
    };
    startRenderLoop() {
        this._rendering = true;
        this.render();
    }
    pauseRenderLoop() {
        this._rendering = false;
    }
    setContext(ctx) {
        this._ctx = ctx;
    }
    _doRender() {
        if (!this._ctx || !this._opt) {
            return;
        }
        const ctx = this._ctx;
        const opt = this._opt;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        ctx.imageSmoothingEnabled = false;
        //sky
        ctx.save();
        ctx.fillStyle = opt.sky;
        ctx.fillRect(0, 0, w, h / 2);
        //ground
        ctx.fillStyle = opt.ground;
        ctx.fillRect(0, h / 2, w, h / 2);
        ctx.restore();
        const halfFovRad = this._fov * 0.0349;
        const virtualAxisModulo = w / (2 * Math.tan(halfFovRad));
        for (let i = 0; i < w; i++) {
            const result = this._castRay(opt, Math.atan((i - w / 2) / virtualAxisModulo));
            if (!result) {
                continue;
            }
            const [scale, surface, offset] = result;
            // console.log(offset)
            const _h = h * scale / 100, cy = (h - _h) / 2;
            ctx.save();
            if (surface.backgroundColor) {
                ctx.fillStyle = surface.backgroundColor;
                ctx.fillRect(i, cy, 1, _h);
            }
            if (surface.source) {
                let { source, clip } = surface;
                if (source.complete) {
                    clip = Array.isArray(clip)
                        ? clip
                        : [0, 0, source.naturalWidth, source.naturalHeight];
                    const offsetPixel = ~~(0.5 * h * (clip[2] / clip[3]));
                    let _offset = clip[0] + offset * offsetPixel;
                    ctx.drawImage(source, (_offset % source.naturalWidth) % clip[2] + clip[0], clip[1], 1, clip[3] - clip[1], i, cy, 1, _h);
                }
            }
            ctx.restore();
        }
        requestAnimationFrame(this.render);
    }
    _castRay(opt, dr) {
        const _v = opt.view;
        const testRay = _v.rotate(dr);
        const testPointDist = [];
        for (const surface of opt.surfaces) {
            const point = testRay.getCrossPoint(surface);
            if (!point) {
                continue;
            }
            const dx = _v.x - point.x, dy = _v.y - point.y, len = Math.sqrt(dx ** 2 + dy ** 2);
            testPointDist.push([len, surface, point]);
        }
        const result = testPointDist.reduce((pre, cur) => cur[0] < pre[0] ? cur : pre, [Infinity]);
        // console.log(result)
        if (result.length < 2) {
            return null;
        }
        const [len, surface, point] = result;
        // const scale = Math.tan(Math.asin(1 / (len + 1)))
        const viewLen = Vector.getModulo(opt.view);
        const scale = Math.tan(1.57 * (Math.max(viewLen - len, 0) / viewLen));
        const _offset = Math.sqrt((surface.x - point.x) ** 2 + (surface.y - point.y) ** 2);
        return [scale, surface, _offset];
    }
};
Renderer = __decorate([
    __param(0, IInput)
], Renderer);
export { Renderer };
