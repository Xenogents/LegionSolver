import { Point } from './point.js';

class LegionSolver {
    constructor(board, pieces, pieceUpdated, a) {
        this.board = board;
        this.pieces = pieces;
        this.pieceUpdated = pieceUpdated;
        this.a = a;

        this.middle = [];
        for (let i = 9; i < 11; i++) {
            for (let j = 10; j < 12; j++) {
                if (this.board[i][j] != -1) {
                    this.middle.push(new Point(i, j));
                }
            }
        }
    }

    solve() {
        this.pieces.sort((a, b) => b.amount - a.amount);
        return this.solveInternal(0);
    }

    solveInternal(position) {
        this.a++;
        if (this.a % 1000 == 0)
            console.log(this.a);

        if (this.pieces.length > 0 && this.pieces[0].amount == 0) {
            return true;
        }
        let point = new Point(position % this.board[0].length, Math.floor(position / this.board[0].length));
    
        if (point.y >= this.board.length) {
            return true;
        }
    
        if (this.board[point.y][point.x] != 0) {
            return this.solveInternal(position + 1);
        }
    
        for (let k = 0; k < this.pieces.length; k++) {
            for (let piece of this.pieces[k].transformations) {
                if (this.pieces[k].amount == 0) {
                    return false;
                }
                if (this.isPlaceable(point, piece)) {
                    this.placePiece(point, piece);
                    this.pieceUpdated(point, piece, true);
                    let spotsMoved = this.takeFromList(k);
                    if (this.isValid() && this.solveInternal(position + 1)) {
                        return true;
                    }
                    this.returnToList(k, spotsMoved);
                    this.takeBackPiece(point, piece);
                    this.pieceUpdated(point, piece, false);
                }
            }
        }
        return false;
    }

    takeFromList(placement) {
        this.pieces[placement].amount--;
        if (placement == this.pieces.length - 1) {
            return 0;
        }
    
        let fill = this.pieces[placement];
        if (this.pieces[placement].amount >= this.pieces[placement + 1].amount) {
            return 0;
        } else {
            for (let i = placement + 1; i < this.pieces.length; i++) {
                if (this.pieces[placement].amount >= this.pieces[i].amount) {
                    this.pieces[placement] = this.pieces[i - 1];
                    this.pieces[i - 1] = fill;
                    return i - 1 - placement;
                }
            }
        }
    
        this.pieces[placement] = this.pieces[this.pieces.length - 1];
        this.pieces[this.pieces.length - 1] = fill;
        return this.pieces.length - 1 - placement;
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
            if (this.board[point.x][point.y] > 0 && this.board[point.x][point.y] <= this.pieces.length) {
                normalPieces++;
            }
        }
    
        return normalPieces != this.middle.length;
    }
    
    isPlaceable(position, piece) {
        for (let point of piece.pointShape) {
            if ((point.y + position.y) > this.board.length - 1
                || (point.x + position.x - piece.offCenter > this.board[0].length - 1
                || (point.y + position.y) < 0
                || (point.x + position.x - piece.offCenter < 0
                || this.board[point.y + position.y][point.x + position.x - piece.offCenter] != 0))) {
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