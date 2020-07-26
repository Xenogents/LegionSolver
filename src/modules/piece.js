import { Point } from './point.js';
import _ from 'underscore';

class Piece {
    constructor(shape, amount, id) {
        this.shape = shape;
        this.amount = amount;
        this.id = id;
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
        Object.defineProperty(this, "transformations", { value: []});

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

        for (let i = 0; i < this.transformations.length - 1; i++) {
            for (let j = i + 1; j < this.transformations.length; j++) {
                if (_.isEqual(this.transformations[i], this.transformations[j])) {
                    this.transformations.splice(j,1);
                    j--;
                }
            }
        }

        return this.transformations;
    }

    get pointTransformations() {
        Object.defineProperty(this, "pointTransformations", { value: []});
        for (let piece of this.transformations) {
            this.pointTransformations.push(piece.pointShape);
        }

        return this.pointTransformations;
    }
}

class PiecePoint extends Point {
    constructor(x, y, isMiddle) {
        super(x, y);
        this.isMiddle = isMiddle;
    }
}

export { Piece, PiecePoint };