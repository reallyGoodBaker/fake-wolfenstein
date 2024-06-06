import { createIdentifier } from '@di/identifier'

export interface IInput {
    w: boolean
    a: boolean
    s: boolean
    d: boolean
    shift: boolean
    ctrl: boolean

    mouse: {
        mh: number
    }

    init(): void
    suspend(): void
    resume(): void
}

export const IInput = createIdentifier<IInput>('input')

const keyMap: any = {
    KeyW: 'w',
    KeyA: 'a',
    KeyS: 's',
    KeyD: 'd',
    ShiftLeft: 'shift',
    ControlLeft: 'ctrl',
}

export class Input implements IInput {
    mouse = {
        mh: 0
    }
    w: boolean = false
    a: boolean = false
    s: boolean = false
    d: boolean = false
    shift: boolean = false
    ctrl: boolean = false
    
    init(): void {
        window.addEventListener('keydown', ev => {
            const key: 'w' | 'a' | 's' | 'd' | 'shift' | 'ctrl' = keyMap[ev.code]

            if (!key) {
                return
            }

            this[key] = true
        })

        window.addEventListener('keyup', ev => {
            const key: 'w' | 'a' | 's' | 'd' | 'shift' | 'ctrl' = keyMap[ev.code]

            if (!key) {
                return
            }

            this[key] = false
        })
        window.addEventListener('mousemove', ev => {
            this.mouse.mh -= ev.movementX * 0.0015
        })
    }

    suspend(): void {

    }

    resume(): void {
        
    }


}