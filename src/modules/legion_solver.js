import { Point } from './point.js';
import { Piece } from './piece.js';

class LegionSolver {
    constructor(board, pieces, onBoardUpdated) {
        this.board = board;
        this.pieces = pieces;
        this.onBoardUpdated = onBoardUpdated;
        this.iterations = 0;
        this.pieceLength = pieces.length;

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

        while (position < this.emptySpots.length && this.pieces[0].amount > 0) {
            if (this.board[this.emptySpots[position].y][this.emptySpots[position].x] != 0) {
                position++;
            } else if (this.pieces[pieceNumber].amount != 0) {
                piece = this.pieces[pieceNumber].transformations[transformationNumber];
                if (this.isPlaceable(this.emptySpots[position], piece)) {
                    this.placePiece(this.emptySpots[position], piece);
                    stack.push([pieceNumber, transformationNumber, this.takeFromList(pieceNumber), position]);
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
                console.log(this.iterations);
                this.onBoardUpdated();
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        return true;
    }

    takeFromList(placement) {
        this.pieces[placement].amount--;

        let fill = this.pieces[placement];
        if (fill.amount >= this.pieces[placement + 1].amount || placement == this.pieceLength - 1) {
            return 0;
        }

        for (let i = placement + 1; i < this.pieceLength; i++) {
            if (this.pieces[placement].amount >= this.pieces[i].amount) {
                this.pieces[placement] = this.pieces[i - 1];
                this.pieces[i - 1] = fill;
                return i - 1 - placement;
            }
        }
    
        this.pieces[placement] = this.pieces[this.pieceLength - 1];
        this.pieces[this.pieceLength - 1] = fill;
        return this.pieceLength - 1 - placement;
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
        return normalPieces != this.middle.length;
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
}

export { LegionSolver };