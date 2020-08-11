import { Point } from './point.js';
import _ from 'lodash';

class Piece {
    static curId = 1;

    constructor(shape, amount, id) {
        this.shape = shape;
        this.amount = amount;
        this.id = id;
    }

    static createPiece(shape, amount) {
        return new Piece(shape, amount, this.curId++);
    }

    get cellCount() {
        Object.defineProperty(this, "cellCount", { value: 0, writable: true });

        for (let i = 0; i < this.shape.length; ++i) {
            for (let j = 0; j < this.shape[i].length; ++j) {
                if (this.shape[i][j] > 0) {
                    this.cellCount++;
                }
            }
        }

        return this.cellCount;
    }

    get pointShape() {
        Object.defineProperty(this, "pointShape", { value: []});

        for (let i = 0; i < this.shape.length; ++i) {
            for (let j = 0; j < this.shape[i].length; ++j) {
                if (this.shape[i][j] == 1) {
                    this.pointShape.push(new PiecePoint(j, i, false));
                } else if (this.shape[i][j] == 2) {
                    this.pointShape.push(new PiecePoint(j, i, true));
                }
            }
        }

        return this.pointShape;
    }

    get offCenter() {
        Object.defineProperty(this, "offCenter", { value: 0, writable: true });

        for (let i = 0; i < this.shape[0].length; i++) {
            if (this.shape[0][i] != 0) {
                this.offCenter = i;
                break;
            }
        }

        return this.offCenter;
    }

    get transformations() {
        Object.defineProperty(this, "transformations", { value: [], writable: true});

        let shape = [...this.shape];
        let newGrid;

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4; j++) {
                newGrid = new Array(shape[0].length).fill(0).map(() => new Array(shape.length).fill(0));
                for (let k = 0; k < shape.length; k++) {
                    for (let l = 0; l < shape[0].length; l++) {
                        if (shape[k][l] != 0) {
                            newGrid[shape[0].length-l-1][k] = shape[k][l];
                        }
                    }
                }
                shape = newGrid;
                this.transformations.push(new Piece(shape, this.amount, this.id));
            }
            newGrid = new Array(shape.length).fill(0).map(() => new Array(shape[0].length).fill(0));
            for (let k = 0; k < shape.length; k++) {
                for (let l = 0; l < shape[0].length; l++) {
                    if (shape[k][l] != 0) {
                        newGrid[shape.length-k-1][l] = shape[k][l];
                    }
                }
            }
            shape = newGrid;
        }

        this.transformations = _.unionWith(this.transformations, _.isEqual);
        return this.transformations;
    }

    get pointTransformations() {
        Object.defineProperty(this, "pointTransformations", { value: []});
        for (let piece of this.transformations) {
            this.pointTransformations.push(piece.pointShape);
        }

        return this.pointTransformations;
    }

    get restrictedTransformations() {
        Object.defineProperty(this, "restrictedTransformations", { value: []});
        for (let piece of this.transformations) {
            if (!piece.shape[0][1 + piece.offCenter] || piece.shape[0][1 + piece.offCenter] == 0) {
                this.restrictedTransformations.push(piece);
            }
        }
        return this.restrictedTransformations;
    }

    get restrictedPointTransformations() {
        Object.defineProperty(this, "restrictedPointTransformations", { value: []});
        for (let piece of this.restrictedTransformations) {
            this.restrictedPointTransformations.push(piece.pointShape);

        }
        return this.restrictedPointTransformations;
    }
}

class PiecePoint extends Point {
    constructor(x, y, isMiddle) {
        super(x, y);
        this.isMiddle = isMiddle;
    }
}

export { Piece, PiecePoint };