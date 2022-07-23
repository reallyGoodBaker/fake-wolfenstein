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
import { IRenderer } from '../engine/Renderer.js';
export const IWinManager = createIdentifier('win-manager');
let WinManager = class WinManager {
    renderer;
    canvas;
    ctx;
    constructor(renderer, canvas) {
        this.renderer = renderer;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        window.addEventListener('resize', () => this._setFitSize());
        this._setFitSize();
    }
    _setFitSize() {
        let w, h;
        if (!window.visualViewport) {
            const rect = document.body.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
        }
        else {
            w = visualViewport.width;
            h = visualViewport.height;
        }
        const _expectHeightCalcFromWidth = w * 9 / 16;
        const _shouldUseExpectHeight = _expectHeightCalcFromWidth <= h;
        this.setSize(_shouldUseExpectHeight
            ? w
            : h * 16 / 9, _shouldUseExpectHeight
            ? _expectHeightCalcFromWidth
            : h);
    }
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    initRenderer() {
        console.log('do init renderer!');
        this.renderer.setContext(this.ctx);
    }
};
WinManager = __decorate([
    __param(0, IRenderer)
], WinManager);
export { WinManager };
