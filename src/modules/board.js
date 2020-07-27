import { Point } from './point.js';

class LegionBoard {
    constructor(board) {
        this.board = board;
        this.states = {
            START: 'start',
            IN_PROGRESS: 'in_progress',
            COMPLETED: 'completed',
        }
        this.state = this.states.START;

        this.legionGroups = [];
        for (let i = 0; i < 16; i++) {
            this.legionGroups[i] = [];
        }

        this.pieceColours = new Map();
        this.pieceColours.set(-1, 'white');
        this.pieceColours.set(0, 'grey');
        for (let i = 0; i < 2; i++) {
            this.pieceColours.set(1 + i * 16, 'orange');
            this.pieceColours.set(2 + i * 16, 'lime');
            this.pieceColours.set(3 + i * 16, 'red');
            this.pieceColours.set(4 + i * 16, 'limegreen');
            this.pieceColours.set(5 + i * 16, 'firebrick');
            this.pieceColours.set(6 + i * 16, 'mediumseagreen');
            this.pieceColours.set(7 + i * 16, 'purple');
            this.pieceColours.set(8 + i * 16, 'lightskyblue');
            this.pieceColours.set(9 + i * 16, 'lightgrey');
            this.pieceColours.set(10 + i * 16, 'aqua');
            this.pieceColours.set(11 + i * 16, 'maroon');
            this.pieceColours.set(12 + i * 16, 'green');
            this.pieceColours.set(13 + i * 16, 'indigo');
            this.pieceColours.set(14 + i * 16, 'dodgerblue');
            this.pieceColours.set(15 + i * 16, 'lightsteelblue');
            this.pieceColours.set(16 + i * 16, 'mediumpurple');
        }

        if (localStorage.getItem("boardFilled")) {
            this.boardFilled = JSON.parse(localStorage.getItem("boardFilled"));
            document.getElementById('boardFilled').innerText = `Board Spaces Filled: ${this.boardFilled}`;
        } else {
            this.boardFilled = 0;
        }
        
        if (localStorage.getItem("isBigClick")) {
            document.getElementById("bigClick").checked = JSON.parse(localStorage.getItem("isBigClick"));
            if (JSON.parse(localStorage.getItem("isBigClick"))) {
                this.activateBigClick();
            }
        } else {
            this.isBigClick = false;
        }
        
        if (localStorage.getItem("isLiveSolve")) {
            document.getElementById("liveSolve").checked = JSON.parse(localStorage.getItem("isLiveSolve"));
            if (JSON.parse(localStorage.getItem("isLiveSolve"))) {
                this.activateLiveSolve();
            }
        } else {
            this.isLiveSolve = false;
        }

        document.getElementById("bigClick").addEventListener("click", this.activateBigClick);
        document.getElementById("liveSolve").addEventListener("click", this.activateLiveSolve);
        document.getElementById("clearBoard").addEventListener("click", this.clearBoard);
    }

    setLegionGroups() {
        for (let i = 0; i < this.board.length / 4; i++) {
            for (let j = i; j < this.board.length / 2; j++) {
                this.legionGroups[0].push(new Point(j, i));
                this.legionGroups[1].push(new Point(i, j + 1))
                this.legionGroups[2].push(new Point(i, this.board[0].length - 2 - j))
                this.legionGroups[3].push(new Point(j, this.board[0].length - 1 - i))
                this.legionGroups[4].push(new Point(this.board.length - 1 - j, this.board[0].length - 1 - i))
                this.legionGroups[5].push(new Point(this.board.length - 1 - i, this.board[0].length - 2 - j))
                this.legionGroups[6].push(new Point(this.board.length - 1 - i, j + 1))
                this.legionGroups[7].push(new Point(this.board.length - 1 - j, i))
            }
        }
        for (let i = this.board.length / 4; i < this.board.length / 2; i++) {
            for (let j = i; j < this.board.length / 2; j++) {
                this.legionGroups[8].push(new Point(j, i));
                this.legionGroups[9].push(new Point(i, j + 1));
                this.legionGroups[10].push(new Point(3 * this.board.length / 4 - 1 - j, this.board.length / 4 + 1 + i));
                this.legionGroups[11].push(new Point(j, this.board[0].length - 1 - i));
                this.legionGroups[12].push(new Point(this.board.length - 1 - j, this.board[0].length - 1 - i));
                this.legionGroups[13].push(new Point(j + this.board.length / 4, i + this.board.length / 4 + 1));
                this.legionGroups[14].push(new Point(j + this.board.length / 4, 3 * this.board.length / 4 - i));
                this.legionGroups[15].push(new Point(this.board.length - j - 1, i));
            }
        }
    }  

    setLegionBorders() {
        for (let i = 0; i < this.board[0].length / 2; i++) {
            this.getLegionCell(i, i).style.borderTopWidth = '3px';
            this.getLegionCell(i, i).style.borderRightWidth = '3px';
            this.getLegionCell(this.board.length - i - 1, i).style.borderBottomWidth = '3px';
            this.getLegionCell(this.board.length - i - 1, i).style.borderRightWidth = '3px';
            this.getLegionCell(i, this.board[0].length - i - 1).style.borderTopWidth = '3px';
            this.getLegionCell(i, this.board[0].length - i - 1).style.borderLeftWidth = '3px';
            this.getLegionCell(this.board.length - i - 1, this.board[0].length - i - 1).style.borderBottomWidth = '3px';
            this.getLegionCell(this.board.length - i - 1, this.board[0].length - i - 1).style.borderLeftWidth = '3px';
        }
        for (let i = 0; i < this.board.length; i++) {
            this.getLegionCell(i, 0).style.borderLeftWidth = '3px';
            this.getLegionCell(i, this.board[0].length / 2).style.borderLeftWidth = '3px';
            this.getLegionCell(i, this.board[0].length - 1).style.borderRightWidth = '3px';
        }
        for (let i = 0; i < this.board[0].length; i++) {
            this.getLegionCell(0, i).style.borderTopWidth = '3px';
            this.getLegionCell(this.board.length / 2, i).style.borderTopWidth = '3px';
            this.getLegionCell(this.board.length - 1, i).style.borderBottomWidth = '3px';
        }
        for (let i = this.board.length / 4; i < 3 * this.board.length / 4; i++) {
            this.getLegionCell(i, Math.floor(this.board[0].length / 4)).style.borderLeftWidth = '3px';
            this.getLegionCell(i, Math.floor(3 * this.board[0].length / 4)).style.borderRightWidth = '3px';
        }
        for (let i = Math.ceil(this.board[0].length / 4); i < Math.floor(3 * this.board[0].length / 4); i++) {
            this.getLegionCell(this.board.length / 4, i).style.borderTopWidth = '3px';
            this.getLegionCell(3 * this.board.length / 4, i).style.borderTopWidth = '3px';   
        }
    }

    findGroupNumber(i, j) {
        for (let k = 0; k < this.legionGroups.length; k++) {
            for (let point of this.legionGroups[k]) {
                if (point.x == i && point.y == j) {
                    return k;
                }
            }
        }
    }

    getLegionCell(i, j) {
        return document.getElementById("legionBoard")
        .getElementsByTagName("tr")[i]
        .getElementsByTagName("td")[j];
    }

    clearBoard() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                this.board[i][j] = -1;
                this.getLegionCell(i, j).style.background = this.pieceColours.get(this.board[i][j])
            }
        }
        this.boardFilled = 0;
        localStorage.setItem("legionBoard", JSON.stringify(this.board));
        localStorage.setItem("boardFilled", JSON.stringify(0));
        document.getElementById('boardFilled').innerText = `Board Spaces Filled: ${boardFilled}`;
    }

    clickBoard(i, j) {
        if (this.state != this.states.START) {
            return;
        }

        if (this.isBigClick) {
            if (this.board[i][j] == -1) {
                for (let point of this.legionGroups[this.findGroupNumber(i, j)]) {
                    let grid = this.getLegionCell(point.x, point.y);
                    grid.style.background = 'grey';
                    if (this.board[point.x][point.y] == -1) {
                        this.boardFilled++;
                    }
                    this.board[point.x][point.y] = 0;
                }
            } else {
                for (let point of this.legionGroups[this.findGroupNumber(i, j)]) {
                    let grid = this.getLegionCell(point.x, point.y);
                    grid.style.background = 'white';
                    if (this.board[point.x][point.y] == 0) {
                        this.boardFilled--;
                    }
                    this.board[point.x][point.y] = -1;
                }
            }
        } else {
            let grid = this.getLegionCell(i, j);
            if (this.board[i][j] == 0) {
                this.board[i][j] = -1;
                grid.style.background = 'white';
                this.boardFilled--;
            } else {
                this.board[i][j] = 0;
                grid.style.background = 'grey';
                this.boardFilled++;
            }
        }
        localStorage.setItem("legionBoard", JSON.stringify(this.board));
        localStorage.setItem("boardFilled", JSON.stringify(this.boardFilled));
        document.getElementById('boardFilled').innerText = `Board Spaces Filled: ${this.boardFilled}`;
    }

    hoverOverBoard(i, j) {
        if (this.state != this.states.START) {
            return;
        }
        if (this.isBigClick) {
            for (let point of this.legionGroups[this.findGroupNumber(i, j)]) {
                if (this.board[point.x][point.y] == -1) {
                    this.getLegionCell(point.x, point.y).style.background = 'silver';
                } else {
                    this.getLegionCell(point.x, point.y).style.background = 'dimgrey';
                }
    
            }
        } else {
            if (this.board[i][j] == -1) {
                this.getLegionCell(i, j).style.background = 'silver';
            } else {
                this.getLegionCell(i, j).style.background = 'dimgrey';
            }
    
        }
    } 

    hoverOffBoard(i, j) {
        if (this.state != this.states.START) {
            return;
        }
        if (this.isBigClick) {
            for (let point of this.legionGroups[this.findGroupNumber(i, j)]) {
                if (this.board[point.x][point.y] == -1) {
                    this.getLegionCell(point.x, point.y).style.background = 'white';
                } else {
                    this.getLegionCell(point.x, point.y).style.background = 'grey';
                }
            }
        } else {
            if (this.board[i][j] == -1) {
                this.getLegionCell(i, j).style.background = 'white';
            } else {
                this.getLegionCell(i, j).style.background = 'grey';
            }
            
        }
    }

    resetBoard() {
        this.state = this.states.START;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] > 0) {
                    this.getLegionCell(i, j).style.background = 'grey';
                    this.board[i][j] = 0;
                }
            }
        }
    }

    colourBoard() {
        let spot;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                spot = this.board[i][j];
                this.getLegionCell(i, j).style.background = this.pieceColours.get(spot);
            }
        }
    }

    activateBigClick() {
        this.isBigClick = !this.isBigClick;
        localStorage.setItem("isBigClick", JSON.stringify(this.isBigClick));
    }
    
    activateLiveSolve() {
        this.isLiveSolve = !this.isLiveSolve;
        localStorage.setItem("isLiveSolve", JSON.stringify(this.isLiveSolve));
        if (this.isLiveSolve) {
            this.colourBoard();
        }
    }
}

export { LegionBoard };