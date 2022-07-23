import {createIdentifier} from '@di'
import {IRenderer} from '@engine/Renderer'

export interface IWinManager {
    setSize(width: number, height: number): void
    initRenderer(): void
}

export const IWinManager = createIdentifier<IWinManager>('win-manager')

export class WinManager implements IWinManager {
    private readonly ctx: CanvasRenderingContext2D

    constructor(
        @IRenderer private readonly renderer: IRenderer,
        private readonly canvas: HTMLCanvasElement,
    ) {
        this.ctx = canvas.getContext('2d')!

        window.addEventListener('resize', () => this._setFitSize())

        this._setFitSize()
    }

    private _setFitSize() {
        let w, h
        if (!window.visualViewport) {
            const rect = document.body.getBoundingClientRect()
            w = rect.width
            h = rect.height
        } else {
            w = visualViewport!.width
            h = visualViewport!.height
        }

        const _expectHeightCalcFromWidth = w*9/16
        const _shouldUseExpectHeight = _expectHeightCalcFromWidth <= h

        this.setSize(
            _shouldUseExpectHeight
                ? w
                : h * 16 / 9,
            _shouldUseExpectHeight
                ? _expectHeightCalcFromWidth
                : h
        )
    }

    setSize(width: number, height: number): void {
        this.canvas.width = width
        this.canvas.height = height
    }

    initRenderer(): void {
        console.log('do init renderer!')
        this.renderer.setContext(this.ctx)
    }
}