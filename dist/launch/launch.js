var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { IWinManager, WinManager } from '../engine/WindowManager.js';
import { IGameLoop, GameLoop } from '../engine/GameLoop.js';
import { InstantiationService, ServiceCollection } from '../di/index.js';
import { IRenderer, Renderer } from '../engine/Renderer.js';
import { IInput, Input } from '../engine/Input.js';
const gameInstantiationCollection = new ServiceCollection([
    [IRenderer, Renderer],
    [IGameLoop, GameLoop],
    [IWinManager, WinManager, [document.getElementById('display')]],
    [IInput, Input]
], []);
const service = new InstantiationService(gameInstantiationCollection);
let Game = class Game {
    gameLoop;
    win;
    constructor(gameLoop, win) {
        this.gameLoop = gameLoop;
        this.win = win;
    }
    start() {
        this.win.initRenderer();
        this.gameLoop.startLoop();
    }
};
Game = __decorate([
    __param(0, IGameLoop),
    __param(1, IWinManager)
], Game);
const gameLoop = service.createInstance(Game);
gameLoop.start();
