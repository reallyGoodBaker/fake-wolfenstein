export class Vector {
    dx;
    dy;
    constructor(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
    static doublePI = Math.PI * 2;
    static rotate(vec, rad) {
        const { dx, dy } = vec;
        const modulo = Math.sqrt(dx ** 2 + dy ** 2);
        let r1 = Math.acos(dx / modulo);
        if (dy < 0) {
            r1 = this.doublePI - r1;
        }
        return {
            dx: Math.cos(r1 + rad) * modulo,
            dy: Math.sin(r1 + rad) * modulo
        };
    }
    static getModulo(vec) {
        const { dx, dy } = vec;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }
    static muilti(vec, ratio) {
        return {
            dx: vec.dx * ratio,
            dy: vec.dy * ratio
        };
    }
}
export class Ray {
    x;
    y;
    dx;
    dy;
    constructor(x = 0, y = 0, dx = 0, dy = 0) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
    getCrossPoint(ray) {
        const x1 = this.x, x2 = x1 + this.dx, x3 = ray.x, x4 = x3 + ray.dx, y1 = this.y, y2 = y1 + this.dy, y3 = ray.y, y4 = y3 + ray.dy, b1 = x1 * (y2 - y1) + y1 * (x1 - x2), b2 = x3 * (y4 - y3) + y3 * (x3 - x4), D = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1), D1 = b2 * (x2 - x1) - b1 * (x4 - x3), D2 = b2 * (y2 - y1) - b1 * (y4 - y3), x0 = D1 / D, y0 = D2 / D;
        if ((Math.max(x1, x2) >= x0 && x0 >= Math.min(x1, x2)) &&
            (Math.max(x3, x4) >= x0 && x0 >= Math.min(x3, x4))) {
            return {
                x: x0,
                y: y0
            };
        }
        return false;
    }
    assignVector(vec) {
        return new Ray(this.x, this.y, this.dx + vec.dx, this.dy + vec.dy);
    }
    moveVector(vec) {
        return new Ray(this.x + vec.dx, this.y + vec.dy, this.dx, this.dy);
    }
    getVector() {
        return {
            dx: this.dx,
            dy: this.dy
        };
    }
    move(vec) {
        this.x += vec.dx;
        this.y += vec.dy;
    }
    transfrom(move, rotation) {
        if (rotation) {
            this.rotate(rotation);
        }
        if (move) {
            this.x += move.dx;
            this.y += move.dy;
        }
    }
    changeVec(vec) {
        return new Ray(this.x, this.y, vec.dx, vec.dy);
    }
    rotate(rad) {
        const vec = Vector.rotate(this, rad);
        return new Ray(this.x, this.y, vec.dx, vec.dy);
    }
}
