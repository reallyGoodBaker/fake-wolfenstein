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

        const texture = new Image()
        texture.src = './texture.jpg'

        const renderOpt = {
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
                // {
                //     x: -4,
                //     y: 1,
                //     dx: 0,
                //     dy: -2,
                //     backgroundColor: 'teal',
                //     source: '',
                //     clip: [0, 0]
                // },
            ]
        }

        const keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            mh: 0,
            pause: false,
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
            if (ev.key === 'Escape') {
                keys.pause = !keys.pause
                if (keys.pause) {
                    this.renderer.pauseRenderLoop()
                } else {
                    this.renderer.startRenderLoop()
                }
            }
        })
        window.addEventListener('mousemove', ev => {
            keys.mh -= ev.movementX * 0.001
        })
        window.addEventListener('mousedown', () => {
            document.body.requestPointerLock()
        })

        renderer.setRenderOpt(renderOpt as RenderOpt)

        const v = renderOpt.view

        const loop = () => requestAnimationFrame(() => {
            
            if (keys.w) {
                v.move(Vector.muilti(v, 0.001))
            }
            if (keys.s) {
                v.move(Vector.muilti(v, -0.001))
            }
            if (keys.a) {
                v.move(Vector.rotate(Vector.muilti(v, 0.001), 1.57))
            }
            if (keys.d) {
                v.move(Vector.rotate(Vector.muilti(v, -0.001), 1.57))
            }
            const {dx, dy} = Vector.rotate(v, keys.mh)
            v.dx = dx
            v.dy = dy
            keys.mh = 0
            // console.log(renderOpt.view)

            loop()
        })

        loop()
    }
}