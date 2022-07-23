import { IRenderer } from '@engine/Renderer'
import { createIdentifier } from '@di'
import {Ray, RenderOpt, Vector} from '@engine/types'

export interface IGameLoop {
    loadScene(): void
    startLoop(): void
}

export const IGameLoop = createIdentifier<IGameLoop>('game-loop')

export class GameLoop implements IGameLoop {
    constructor(
        @IRenderer private readonly renderer: IRenderer,
    ) {}

    loadScene(): void {
        
    }

    startLoop(): void {
        const renderer = this.renderer

        const renderOpt = {
            light: '#fff',
            sky: 'gray',
            ground: '#aba',
            view: new Ray(0, 0, 0, 8),
            surfaces: [
                {
                    x: -4,
                    y: 1,
                    dx: 8,
                    dy: 1,
                    backgroundColor: 'blue',
                    source: '',
                    clip: [0, 0]
                },
                {
                    x: 4,
                    y: 1,
                    dx: 2,
                    dy: -2,
                    backgroundColor: 'yellow',
                    source: '',
                    clip: [0, 0]
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
        }

        const keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            mh: 0,
        }

        window.addEventListener('keydown', ev => {
            if (ev.key === 'w') {
                keys.w = true
            }
            if (ev.key === 's') {
                keys.s = true
            }
            if (ev.key === 'a') {
                keys.a = true
            }
            if (ev.key === 'd') {
                keys.d = true
            }
        })
        window.addEventListener('keyup', ev => {
            if (ev.key === 'w') {
                keys.w = false
            }
            if (ev.key === 's') {
                keys.s = false
            }
            if (ev.key === 'a') {
                keys.a = false
            }
            if (ev.key === 'd') {
                keys.d = false
            }
        })
        window.addEventListener('mousemove', ev => {
            keys.mh -= ev.movementX * 0.2
        })
        window.addEventListener('mousedown', () => {
            document.body.requestPointerLock()
        })

        renderer.setRenderOpt(renderOpt as RenderOpt)

        this.renderer.startRenderLoop()

        const v = renderOpt.view

        const loop = () => requestIdleCallback(() => {
            
            if (keys.w) {
                v.y += 0.05
            }
            if (keys.s) {
                v.y -= 0.05
            }
            if (keys.a) {
                v.x -= 0.05
            }
            if (keys.d) {
                v.x += 0.05
            }
            Vector.rotate(renderOpt.view, keys.mh)
            keys.mh = 0
            // console.log(dx, dy)

            loop()
        })

        loop()
    }
}