import { Point } from './point.js';

class LegionSolver {
    constructor(board, pieces) {
        this.board = board;
        this.pieces = pieces;
        this.a = 0;

        this.middle = [];
        for (let i = 9; i < 11; i++) {
            for (let j = 10; j < 12; j++) {
                if (this.board[i][j] != -1) {
                    this.middle.push(new Point(i, j));
                }
            }
        }

        this.emptySpot = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] == 0) {
                    this.emptySpot.push(new Point(j, i));
                }
            }
        }
    }

    solve() {
        this.pieces.sort((a, b) => b.amount - a.amount);
        return this.solveInternal(0);
    }

    solveInternal(position) {
        // this.a++;
        // if (this.a % 10000000 == 0)
        //     console.log(this.a);

        if (position >= this.emptySpot.length || this.pieces[0].amount == 0) {
            return true;
        }
        let point = this.emptySpot[position];

        if (this.board[point.y][point.x] != 0) {
            return this.solveInternal(position + 1);
        }
    
        for (let k = 0; k < this.pieces.length; k++) {
            if (this.pieces[k].amount == 0) {
                return false;
            }
            for (let piece of this.pieces[k].transformations) {
                if (this.isPlaceable(point, piece)) {
                    this.placePiece(point, piece);
                    //this.pieceUpdated(point, piece, true);
                    let spotsMoved = this.takeFromList(k);
                    if (this.solveInternal(position + 1)) {
                        return true;
                    }
                    this.returnToList(k, spotsMoved);
                    this.takeBackPiece(point, piece);
                    //this.pieceUpdated(point, piece, false);
                }
            }
        }
        return false;
    }

    takeFromList(placement) {
        this.pieces[placement].amount--;

        let fill = this.pieces[placement];
        if (fill.amount >= this.pieces[placement + 1].amount || placement == this.pieces.length - 1) {
            return 0;
        }

        for (let i = placement + 1; i < this.pieces.length; i++) {
            if (this.pieces[placement].amount >= this.pieces[i].amount) {
                this.pieces[placement] = this.pieces[i - 1];
                this.pieces[i - 1] = fill;
                return i - 1 - placement;
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