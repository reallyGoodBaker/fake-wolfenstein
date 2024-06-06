import {IWinManager, WinManager} from '@engine/WindowManager'
import {IGameLoop, GameLoop} from '@engine/GameLoop'
import {InstantiationService, ServiceCollection} from '@di'
import {IRenderer, Renderer} from '@engine/Renderer'
import { IInput, Input } from '@engine/Input'

const gameInstantiationCollection = new ServiceCollection([
    [IRenderer, Renderer],
    [IGameLoop, GameLoop],
    [IWinManager, WinManager, [document.getElementById('display')]],
    [IInput, Input]
], [])

const service = new InstantiationService(gameInstantiationCollection)

class Game {
    constructor(
        @IGameLoop private readonly gameLoop: IGameLoop,
        @IWinManager private readonly win: IWinManager,
    ) {
        
    }

    start() {
        this.win.initRenderer()
        this.gameLoop.startLoop()
    }
}

const gameLoop = service.createInstance<Game>(Game)
gameLoop.start()