import { Point } from './point.js';
import { Piece } from './piece.js';
import _ from 'lodash';

class LegionSolver {
    pausePromise;
    pauseResolve;
    iterations
    directionFree;
    success;
    shouldStop;

    constructor(board, pieces, onBoardUpdated) {
        this.board = board;
        this.pieces = pieces;
        this.onBoardUpdated = onBoardUpdated;
        this.iterations = 0;
        this.pieceLength = pieces.length;
        this.valid = true;
        this.pieceNumber = 0;
        this.transformationNumber = 0;
        this.restrictedPieceNumber = 0;
        this.restrictedTransformationNumber = 0;
        this.time = new Date().getTime();

        this.middle = [];
        for (let i = this.board.length / 2 - 1; i < this.board.length / 2 + 1; i++) {
            for (let j = this.board[0].length / 2 - 1; j < this.board[0].length / 2 + 1; j++) {
                if (this.board[i][j] != -1) {
                    this.middle.push(new Point(j, i));
                }
            }
        }

        this.emptySpots = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] == 0) {
                    this.emptySpots.push(new Point(j, i));
                }
            }
        }

        this.restrictedSpots = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                this.searchSurroundings(j, i);
            }
        }
        
        this.longSpaces = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                if (this.checkLongSpace(j, i) == "horizontal") {
                    this.longSpaces.push(new Point(j, i));
                }
                if (this.checkLongSpace(j, i) == "vertical") {
                    this.longSpaces.push(new Point(j, i));
                }
            }
        }
        this.firstAlgorithm = !!this.longSpaces.length;
    }

    async solve() {
        this.pieces.sort((a, b) => b.amount * b.cellCount - a.amount * a.cellCount);
        this.pieces.push(new Piece([[]], 0, -1));
        this.restrictedSpots.sort((a, b) => b.spotsFilled - a.spotsFilled);
        this.success = await this.solveInternal();
        return this.success;
    }

    async solveInternal(batchSize=30000) {
        let stack = [];
        let spotsMoved;
        let piece;
        let point;
        let position = 0;

        while (this.pieces[0].amount > 0 || !this.valid) {
            if (this.shouldStop) {
                return;
            }
            if (this.valid && this.restrictedSpots.length != 0 && this.pieces[this.restrictedPieceNumber].amount && this.directionFree != 5 && !this.firstAlgorithm) {
                if (this.restrictedPieceNumber != this.pieceLength) {
                    point = this.restrictedSpots[0];
                    piece = this.pieces[this.restrictedPieceNumber].restrictedTransformations[this.restrictedTransformationNumber];
                    this.determineDirectionFree(point);
                    if (this.isPlaceable(point, piece)) {
                        stack.push([0, 0, this.takeFromList(this.restrictedPieceNumber), [...this.restrictedSpots], 
                        point, this.restrictedPieceNumber, this.restrictedTransformationNumber, this.directionFree, [], 0, this.valid]);
                        this.restrictedSpots.splice(0, 1);
                        this.placePiece(point, piece);
                        this.isValid();
                        this.restrictedPieceNumber = 0;
                        this.restrictedTransformationNumber = 0;
                    } else {
                        this.changeIndex(true);
                    }
                }
            } else if (this.valid && this.pieces[this.pieceNumber].amount && (this.firstAlgorithm || this.restrictedSpots.length == 0) && this.directionFree != 5){
                this.directionFree = 0;
                if (!this.firstAlgorithm) {
                    position = 0;
                    while (position < this.emptySpots.length && this.board[this.emptySpots[position].y][this.emptySpots[position].x] != 0) {
                        position++;
                    }
                } else {

                }
                if (position == this.emptySpots.length) {
                    return true;
                }
                point = this.emptySpots[position];
                piece = this.pieces[this.pieceNumber].transformations[this.transformationNumber];
                if (this.isPlaceable(point, piece)) {
                    let filler = [];
                    for (let i = 0; i < this.longSpaces.length; i++) {
                        filler.push(this.longSpaces[i]);
                    }
                    stack.push([this.pieceNumber, this.transformationNumber, this.takeFromList(this.pieceNumber), [...this.restrictedSpots],
                    point, 0, 0, 0, filler, position, this.valid]);
                    this.placePiece(point, piece);
                    this.isValid();

                    if (this.firstAlgorithm) {
                        while (position < this.emptySpots.length && this.board[this.emptySpots[position].y][this.emptySpots[position].x] != 0) {
                            position++;
                        }
                        if (position == this.emptySpots.length) {
                            return true;
                        }
                    }

                    this.pieceNumber = 0;
                    this.transformationNumber = 0;
                } else {
                    this.changeIndex(false);
                }
            } else {
                if (stack.length == 0) {
                    return false;
                }
                if (!this.valid) {
                    this.valid = true;
                }

                [this.pieceNumber, this.transformationNumber, spotsMoved, this.restrictedSpots,
                    point, this.restrictedPieceNumber, this.restrictedTransformationNumber, this.directionFree, this.longSpaces, position, this.valid] = stack.pop();
                if (this.directionFree == 0) {
                    this.returnToList(this.pieceNumber, spotsMoved);
                    this.takeBackPiece(point, this.pieces[this.pieceNumber].transformations[this.transformationNumber])
                } else {
                    this.returnToList(this.restrictedPieceNumber, spotsMoved);
                    this.takeBackPiece(point, this.pieces[this.restrictedPieceNumber].restrictedTransformations[this.restrictedTransformationNumber])
                }
                this.firstAlgorithm = !(this.longSpaces.length == 0);
                if (!this.firstAlgorithm) {
                    this.changeIndex(!this.restrictedSpots.length == 0)
                } else {
                    this.changeIndex(false);
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
        while (fill.amount * fill.cellCount < this.pieces[index].amount * this.pieces[index].cellCount)
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
        if (!piece) {
            return false;
        }
        for (let point of piece.pointShape) {
            let x;
            let y;
            [x, y] = this.determinePoint(position, piece, point);
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
        let realPoints = []
        for (let point of piece.pointShape) {
            let x;
            let y;
            [x, y] = this.determinePoint(position, piece, point);
            if (!point.isMiddle) {
                this.board[y][x] = piece.id;
            } else {
                this.board[y][x] = piece.id + 18;
            }
            realPoints.push(new Point(x, y))
            for (let i = 0; i < this.restrictedSpots.length; i++) {
                if (this.restrictedSpots[i].x == x && this.restrictedSpots[i].y == y) {
                    this.restrictedSpots.splice(i, 1)
                    i--;
                }
            }
            for (let i = 0; i < this.longSpaces.length; i++) {
                if (this.longSpaces[i].x == x && this.longSpaces[i].y == y) {
                    this.longSpaces.splice(i, 1)
                    i--;
                }
            }
            if (this.longSpaces.length == 0) {
                this.firstAlgorithm = false;
            }
        }
        for (let point of realPoints) {    
            this.searchSurroundings(point.x, point.y + 1)
            this.searchSurroundings(point.x, point.y - 1)
            this.searchSurroundings(point.x + 1, point.y)
            this.searchSurroundings(point.x - 1, point.y)
        }

        let spliceElements = []
        for (let i = 0; i < this.restrictedSpots.length - 1; i++) {
            for (let j = i + 1; j < this.restrictedSpots.length; j++) {
                if (this.restrictedSpots[i].x == this.restrictedSpots[j].x && this.restrictedSpots[i].y == this.restrictedSpots[j].y) {
                    spliceElements.push(i);
                }
            }
        }
        for (let i = spliceElements.length - 1; i >= 0; i--) {
            this.restrictedSpots.splice(spliceElements[i], 1);
        }
        this.restrictedSpots.sort((a, b) => b.spotsFilled - a.spotsFilled)
    }

    takeBackPiece(position, piece) {
        for (let point of piece.pointShape) {
            let x;
            let y;
            [x, y] = this.determinePoint(position, piece, point);
            this.board[y][x] = 0;
        }
    }

    searchSurroundings(x, y) {
        let restrictedSpaces = 0;
        if (this.board[y] && this.board[y][x] == 0) {
            if (this.board[y + 1] && this.board[y + 1][x] == 0) {
                restrictedSpaces++;
            }
            if (this.board[y - 1] && this.board[y - 1][x] == 0) {
                restrictedSpaces++;
            }
            if (this.board[y] && this.board[y][x + 1] == 0) {
                restrictedSpaces++;
            }
            if (this.board[y] && this.board[y][x - 1] == 0) {
                restrictedSpaces++;
            }
            if (restrictedSpaces <= 1) {
                this.restrictedSpots.push(new RestrictedPoint(x, y, 4 - restrictedSpaces));
            }
        }
    }

    checkLongSpace(x, y) {
        if (this.board[y + 1] && this.board[y + 1][x] == 0
            && this.board[y - 1] && this.board[y - 1][x] == 0
            && this.board[y] && this.board[y][x + 1] != 0
            && this.board[y] && this.board[y][x - 1] != 0) {
            return "vertical";
        }
        if (this.board[y + 1] && this.board[y + 1][x] != 0
            && this.board[y - 1] && this.board[y - 1][x] != 0
            && this.board[y] && this.board[y][x + 1] == 0
            && this.board[y] && this.board[y][x - 1] == 0) {
            return "horizontal";
        }
    }

    changeIndex(restricted) {
        if (restricted) {
            if (this.restrictedTransformationNumber < this.pieces[this.restrictedPieceNumber].restrictedTransformations.length - 1) {
                this.restrictedTransformationNumber++;
            } else {
                this.restrictedPieceNumber++;
                this.restrictedTransformationNumber = 0;
            }
        } else {
            if (this.transformationNumber < this.pieces[this.pieceNumber].transformations.length - 1) {
                this.transformationNumber++;
            } else {
                this.pieceNumber++;
                this.transformationNumber = 0;
            }
        }
    }

    determineDirectionFree(point) {
        if (this.board[point.y - 1] && this.board[point.y - 1][point.x] == 0) {
            this.directionFree = 1;
        } else if (this.board[point.y] && this.board[point.y][point.x + 1] == 0) {
            this.directionFree = 2;
        } else if (this.board[point.y + 1] && this.board[point.y + 1][point.x] == 0) {
            this.directionFree = 3;
        } else if (this.board[point.y] && this.board[point.y][point.x - 1] == 0) {
            this.directionFree =  4;
        } else {
            this.directionFree = 5;
        }
    }

    determinePoint(position, piece, point) {
        let x;
        let y;
        if (this.directionFree == 0 || this.directionFree == 3 || this.directionFree == 5) {
            x = position.x + point.x - piece.offCenter;
            y = position.y + point.y;
        } else if (this.directionFree == 1) {
            x = position.x - point.x + piece.offCenter;
            y = position.y - point.y;
        } else if (this.directionFree == 2) {
            x = position.x + point.y;
            y = position.y + point.x - piece.offCenter;
        } else {
            x = position.x - point.y;
            y = position.y - point.x + piece.offCenter;
        }
        return [x, y];
    }

    pause() {
        this.time -= new Date().getTime();
        if (this.iterations != 0) {
            document.getElementById("iterations").style.display = 'block';
            document.getElementById("iterationsValue").innerText = `${this.iterations}`;

            document.getElementById("time").style.display = 'block';
            document.getElementById("timeValue").innerText = `${-this.time}ms`;
        }
        this.pausePromise = new Promise(resolve => this.pauseResolve = resolve);
    }

    continue() {
        this.time += new Date().getTime();
        document.getElementById("iterations").style.display = 'none';
        document.getElementById("time").style.display = 'none';
        this.pauseResolve();
        this.pausePromise = null;
    }

    stop() {
        this.shouldStop = true;
    }
}

class RestrictedPoint extends Point {
    constructor(x, y, spotsFilled) {
        super(x, y)
        this.spotsFilled = spotsFilled;
    }
}

export { LegionSolver };