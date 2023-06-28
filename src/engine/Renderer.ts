import { createIdentifier } from '@di'
import { RenderOpt, IPoint, Surface, Vector } from '@engine/types'

export interface IRenderer {
    setRenderScale(ratio: number): void
    startRenderLoop(): void
    pauseRenderLoop(): void
    setRenderOpt(opt: RenderOpt): void
    setContext(ctx: CanvasRenderingContext2D): void
}

export const IRenderer = createIdentifier<IRenderer>('renderer')

export class Renderer implements IRenderer {

    private _ctx?: CanvasRenderingContext2D
    private _opt?: RenderOpt
    private _rendering: boolean = false
    private _fov: number = 74

    constructor() {
        
    }

    setRenderOpt(opt: RenderOpt): void {
        this._opt = opt
    }

    setRenderScale(ratio: number): void {
        this._ctx?.scale(ratio, ratio)
    }

    render = () => {
        let doShowFps = true
        let frame = 0
        let fps = 0

        if (!this._ctx || !this._opt) {
            return
        }

        if (this._rendering) {
            this._doRender()
        }

        if (doShowFps) {
            fps = frame
            frame = 0
            doShowFps = false
        }
        const ctx = this._ctx
        ctx.save()
        ctx.fillStyle = 'red'
        ctx.font = '20px sans-serif'
        ctx.fillText(fps + '', 0, 20)
        ctx.restore()
        frame++
    }

    startRenderLoop(): void {
        this._rendering = true
        this.render()
    }

    pauseRenderLoop(): void {
        this._rendering = false
    }

    setContext(ctx: CanvasRenderingContext2D): void {
        this._ctx = ctx
    }

    private _doRender() {
        if (!this._ctx || !this._opt) {
            return
        }

        const ctx = this._ctx
        const opt = this._opt
        const w = ctx.canvas.width
        const h = ctx.canvas.height

        ctx.imageSmoothingEnabled=false

        //sky
        ctx.save()
        ctx.fillStyle = opt.sky
        ctx.fillRect(0, 0, w, h / 2)

        //ground
        ctx.fillStyle = opt.ground
        ctx.fillRect(0, h / 2, w, h / 2)
        ctx.restore()

        const halfFovRad = this._fov * 0.0349
        const virtualAxisModulo = w / (2 * Math.tan(halfFovRad))
        for (let i = 0; i < w; i++) {
            const result = this._castRay(opt, Math.atan((i - w / 2) / virtualAxisModulo))

            if (!result) {
                continue
            }

            const [scale, surface, offset] = result
            // console.log(offset)

            const _h = h * scale/100,
                cy = (h - _h) / 2

            ctx.save()
            if (surface.backgroundColor) {
                ctx.fillStyle = surface.backgroundColor
                ctx.fillRect(i, cy, 1, _h)
            }

            if (surface.source) {
                let { source, clip } = surface

                if (source.complete) {
                    clip = Array.isArray(clip)
                        ? clip
                        : [0, 0, source.naturalWidth, source.naturalHeight]

                    const offsetPixel = ~~(0.5*h*(clip[2]/clip[3]))
                    let _offset = clip[0] + offset * offsetPixel

                    ctx.drawImage(
                        source,
                        (_offset % source.naturalWidth) % clip[2] + clip[0],
                        clip[1],
                        1, clip[3] - clip[1],
                        i, cy,
                        1, _h
                    )

                }
            }
            ctx.restore()

        }

        requestAnimationFrame(this.render)
    }

    private _castRay(opt: RenderOpt, dr: number): [number, Surface, number] | null {
        const _v = opt.view

        const testRay = _v.rotate(dr)
        const testPointDist: Array<[number, Surface, IPoint]> = []
        for (const surface of opt.surfaces) {
            const point = testRay.getCrossPoint(surface)
            if (!point) {
                continue
            }

            const dx = _v.x - point.x,
                dy = _v.y - point.y,
                len = Math.sqrt(dx ** 2 + dy ** 2)

            testPointDist.push([len, surface, point])
        }
        const result = testPointDist.sort(([a], [b]) => a - b)[0]
        if (!result) {
            return null
        }

        const [len, surface, point] = result

        // const scale = Math.tan(Math.asin(1 / (len + 1)))
        const viewLen = Vector.getModulo(opt.view)
        const scale = Math.tan(
            1.57 * (Math.max(viewLen - len, 0) / viewLen)
        )
        const _offset = Math.sqrt((surface.x - point.x) ** 2 + (surface.y - point.y) ** 2)

        return [scale, surface, _offset]
    }

}