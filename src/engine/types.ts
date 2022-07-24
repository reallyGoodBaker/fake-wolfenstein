export interface IPoint {
    x: number
    y: number
}

export interface IVector {
    dx: number
    dy: number
}

export interface IRay extends IPoint, IVector {}

export interface Surface extends IRay {
    backgroundColor?: string
    source?: HTMLImageElement
    clip?: [number, number, number, number]
}

export class Vector implements IVector {
    constructor(
        public dx: number,
        public dy: number
    ) { }

    static rotate(vec: IVector, rad: number) {
        const {dx, dy} = vec
        const modulo = Math.sqrt(dx**2 + dy**2)
        let r1 = Math.acos(dx/modulo)
        if (dy < 0) {
            r1 = 6.28 - r1
        }

        return {
            dx: Math.cos(r1 + rad) * modulo,
            dy: Math.sin(r1 + rad) * modulo
        }
    }

    static getModulo(vec: IVector) {
        const {dx, dy} = vec
        return Math.sqrt(dx**2 + dy**2)
    }

    static muilti(vec: IVector, ratio: number) {
        return {
            dx: vec.dx * ratio,
            dy: vec.dy * ratio
        }
    }
}

export class Ray implements IRay {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public dx: number = 0,
        public dy: number = 0
    ) { }

    getCrossPoint(ray: IRay) {
        const x1 = this.x,
            x2 = x1 + this.dx,
            x3 = ray.x,
            x4 = x3 + ray.dx,
            y1 = this.y,
            y2 = y1 + this.dy,
            y3 = ray.y,
            y4 = y3 + ray.dy,

            b1 = x1 * (y2 - y1) + y1 * (x1 - x2),
            b2 = x3 * (y4 - y3) + y3 * (x3 - x4),
            D = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1),
            D1 = b2 * (x2 - x1) - b1 * (x4 - x3),
            D2 = b2 * (y2 - y1) - b1 * (y4 - y3),

            x0 = D1 / D, y0 = D2 / D


        if (
            (Math.max(x1, x2) >= x0 && x0 >= Math.min(x1, x2)) &&
            (Math.max(x3, x4) >= x0 && x0 >= Math.min(x3, x4))
        ) {
            return {
                x: x0,
                y: y0
            }
        }

        return false
    }

    assignVector(vec: IVector) {
        return new Ray(
            this.x, this.y,
            this.dx + vec.dx,
            this.dy + vec.dy
        )
    }

    moveVector(vec: IVector) {
        return new Ray(
            this.x + vec.dx,
            this.y + vec.dy,
            this.dx,
            this.dy
        )
    }

    getVector() {
        return {
            dx: this.dx,
            dy: this.dy
        }
    }

    move(vec: IVector) {
        this.x += vec.dx
        this.y += vec.dy
    }

    transfrom(move: IVector, rotation: number) {
        if (rotation) {
            this.rotate(rotation)
        }

        if (move) {
            this.x += move.dx
            this.y += move.dy
        }
    }

    changeVec(vec: Vector) {
        return new Ray(
            this.x, this.y,
            vec.dx, vec.dy
        )
    }

    rotate(rad: number) {
        const vec = Vector.rotate(this, rad)
        return new Ray(
            this.x, this.y,
            vec.dx, vec.dy
        )
    }
}

export type RenderOpt = {
    light: string
    sky: string
    ground: string
    view: Ray
    surfaces: Surface[]
}