import { createIdentifier } from '../di/index.js';
export const IRenderer = createIdentifier('renderer');
export class Renderer {
    _ctx;
    _opt;
    _vsync = false;
    setRenderOpt(opt) {
        this._opt = opt;
    }
    setRenderScale(ratio) {
        this._ctx?.scale(ratio, ratio);
    }
    setVSyncEnable(bool) {
        this._vsync = bool;
    }
    startRenderLoop() {
        const vsync = this._vsync;
        let renderedPreviousFrame = false;
        let doShowFps = false;
        let frame = 0;
        let fps = 0;
        const nextTick = () => {
            requestAnimationFrame(() => {
                if (!this._ctx || !this._opt) {
                    return;
                }
                if (vsync && !renderedPreviousFrame) {
                    return;
                }
                this._doRender();
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
                renderedPreviousFrame = true;
                nextTick();
            });
        };
        nextTick();
        setInterval(() => {
            doShowFps = true;
        }, 1000);
    }
    pauseRenderLoop() {
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
        //sky
        ctx.save();
        ctx.fillStyle = opt.sky;
        ctx.fillRect(0, 0, w, h / 2);
        //ground
        ctx.fillStyle = opt.ground;
        ctx.fillRect(0, h / 2, w, h / 2);
        ctx.restore();
        //this._castRay(opt, 0, 0, w, h, ctx)
        for (let i = -37; i < 37; i++) {
            this._castRay(opt, i, w, h, ctx);
        }
    }
    _castRay(opt, dr, width, height, ctx) {
        const _v = opt.view;
        const dx = Math.sin(dr * 3.14 / 180) * 10, dy = Math.cos(dr * 3.14 / 180) * 10;
        const testRay = _v.assignVector({ dx, dy });
        const testPointDist = [];
        for (const surface of opt.surfaces) {
            const point = testRay.getCrossPoint(surface);
            if (!point) {
                continue;
            }
            const dx = _v.x - point.x, dy = _v.y - point.y, len = Math.sqrt(dx ** 2 + dy ** 2);
            testPointDist.push([len, surface]);
        }
        const result = testPointDist.sort(([a], [b]) => a - b)[0];
        if (!result) {
            return;
        }
        const scale = Math.asin(1 / (result[0] + 1.1));
        const w = 20, h = height * scale, cx = (dx / 6 * width / 2) + width / 2, cy = (height - h) / 2;
        ctx.save();
        ctx.fillStyle = result[1].backgroundColor;
        ctx.fillRect(cx, cy, w, h);
        ctx.restore();
        // console.log(scale)
    }
}
