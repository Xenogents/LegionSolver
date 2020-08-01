import { Point } from './point.js';
import { Piece } from './piece.js';

class LegionSolver {
    pausePromise;
    pauseResolve;

    constructor(board, pieces, onBoardUpdated) {
        this.board = board;
        this.pieces = pieces;
        this.onBoardUpdated = onBoardUpdated;
        this.iterations = 0;
        this.pieceLength = pieces.length;
        this.valid = true;
        this.time = new Date().getTime();

        this.middle = [];
        for (let i = 9; i < 11; i++) {
            for (let j = 10; j < 12; j++) {
                if (this.board[i][j] != -1) {
                    this.middle.push(new Point(j, i));
                }
            }
        }

        this.emptySpots = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] == 0) {
                    this.emptySpots.push(new Point(j, i));
                }
            }
        }
    }

    async solve() {
        this.pieces.sort((a, b) => b.amount - a.amount);
        this.pieces.push(new Piece([[]], 0, -5));
        return await this.solveInternal();
    }

    async solveInternal(batchSize=1000000) {
        let stack = [];
        let pieceNumber = 0;
        let transformationNumber = 0;
        let spotsMoved;
        let piece;
        let position = 0;

        while ((position < this.emptySpots.length && this.pieces[0].amount > 0) || !this.valid) {
            let point = this.emptySpots[position];
            if (this.valid && this.board[point.y][point.x] != 0) {
                position++;
            } else if (this.valid && this.pieces[pieceNumber].amount) {
                piece = this.pieces[pieceNumber].transformations[transformationNumber];
                if (this.isPlaceable(point, piece)) {
                    this.placePiece(point, piece);
                    this.isValid();
                    stack.push([pieceNumber, transformationNumber, this.takeFromList(pieceNumber), position]);
                    if (!this.pieces[0].amount) {
                        return true;
                    }
                    position++;
                    pieceNumber = 0;
                    transformationNumber = 0;
                } else {
                    if (transformationNumber < this.pieces[pieceNumber].transformations.length - 1) {
                        transformationNumber++;
                    } else {
                        pieceNumber++;
                        transformationNumber = 0;
                    }
                }
            } else {
                if (stack.length == 0) {
                    return false;
                }
                if (!this.valid) {
                    this.valid = true;
                }

                [pieceNumber, transformationNumber, spotsMoved, position] = stack.pop();
                this.returnToList(pieceNumber, spotsMoved);
                this.takeBackPiece(this.emptySpots[position], this.pieces[pieceNumber].transformations[transformationNumber])
                if (transformationNumber < this.pieces[pieceNumber].transformations.length - 1) {
                    transformationNumber++;
                } else {
                    pieceNumber++;
                    transformationNumber = 0;
                }
            }

            this.iterations++;
            if (this.iterations % batchSize == 0) {
                this.onBoardUpdated();
                await new Promise(resolve => setTimeout(resolve, 0));
                await this.pausePromise;
            }
        }

        return true;
    }

    takeFromList(placement) {
        this.pieces[placement].amount--;
        let fill = this.pieces[placement];
        let index = placement + 1;
        while (fill.amount < this.pieces[index].amount)
            index++;
        this.pieces[placement] = this.pieces[index - 1];
        this.pieces[index - 1] = fill;
        return index - 1 - placement;
    }

    returnToList(placement, spotsMoved) {
        let fill = this.pieces[placement];
        this.pieces[placement] = this.pieces[placement + spotsMoved];
        this.pieces[placement + spotsMoved] = fill;
        this.pieces[placement].amount++;
    }

    isValid() {
        if (this.middle.length == 0) 
            return true;
        
        let normalPieces = 0;
        for (let point of this.middle) {
            if (this.board[point.y][point.x] > 0 && this.board[point.y][point.x] <= this.pieceLength) {
                normalPieces++;
            }
        }

        this.valid = normalPieces != this.middle.length;
    }
    
    isPlaceable(position, piece) {
        for (let point of piece.pointShape) {
            let x = point.x + position.x - piece.offCenter;
            let y = point.y + position.y;
            if (
                y >= this.board.length
                || y < 0
                || x >= this.board[0].length
                || x < 0
                || this.board[y][x] != 0) {
                return false;
            }
        }

        return true;
    }


    placePiece(position, piece) {
        for (let point of piece.pointShape) {
            if (!point.isMiddle) {
                this.board[point.y + position.y][point.x + position.x - piece.offCenter] = piece.id;
            } else {
                this.board[point.y + position.y][point.x + position.x - piece.offCenter] = piece.id + 16;
            }
        }
    }

    takeBackPiece(position, piece) {
        for (let point of piece.pointShape) {
            this.board[point.y + position.y][point.x + position.x - piece.offCenter] = 0;
        }
    }

    pause() {
        this.time -= new Date().getTime();
        document.getElementById("iterations").innerText = `Iterations: ${this.iterations}`;
        document.getElementById("time").innerText = `Time: ${-this.time}ms`;
        this.pausePromise = new Promise(resolve => this.pauseResolve = resolve);
    }

    continue() {
        this.time += new Date().getTime();
        document.getElementById("iterations").innerText = "";
        document.getElementById("time").innerText = "";
        this.pauseResolve();
        this.pausePromise = null;
    }
}

export { LegionSolver };