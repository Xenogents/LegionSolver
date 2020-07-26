import './styles.css';
import { Piece } from './modules/piece.js';
import { Point } from './modules/point.js';
import { LegionSolver } from './modules/legion_solver.js';

// TODO: Remove extra 2s.
const defaultPieces = [
    [
        [2]
    ],
    [
        [2, 2]
    ],
    [
        [1, 0],
        [2, 1]
    ],
    [
        [1, 2, 1]
    ],
    [
        [1, 0, 0],
        [1, 2, 1]
    ],
    [
        [2, 2],
        [2, 2]
    ],
    [
        [1, 2, 2, 1]
    ],
    [
        [0, 1, 0],
        [1, 2, 1]
    ],
    [
        [1, 2, 0],
        [0, 2, 1]
    ],
    [
        [1, 0, 0, 0, 1],
        [0, 1, 2, 1, 0]
    ],
    [
        [1, 1, 2],
        [0, 1, 1]
    ],
    [
        [1, 1, 2, 1, 1],
    ],
    [
        [0, 0, 1],
        [1, 1, 2],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [1, 2, 1],
        [0, 1, 0]
    ],
    [
        [1, 2, 0, 0],
        [0, 1, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 2, 0],
        [0, 1, 1]
    ],
];

let pieces = [];
let amounts = [];

let legionBoard = [];
for (let i = 0; i < 20; i++) {
    legionBoard[i] = [];
    for (let j = 0; j < 22; j++) {
        legionBoard[i][j] = -1;
    }
}

const pieceColours = new Map();
pieceColours.set(-1, 'white');
pieceColours.set(0, 'grey');
for (let i = 0; i < 2; i++) {
    pieceColours.set(1 + i * defaultPieces.length, 'orange');
    pieceColours.set(2 + i * defaultPieces.length, 'lime');
    pieceColours.set(3 + i * defaultPieces.length, 'red');
    pieceColours.set(4 + i * defaultPieces.length, 'limegreen');
    pieceColours.set(5 + i * defaultPieces.length, 'firebrick');
    pieceColours.set(6 + i * defaultPieces.length, 'mediumseagreen');
    pieceColours.set(7 + i * defaultPieces.length, 'purple');
    pieceColours.set(8 + i * defaultPieces.length, 'lightskyblue');
    pieceColours.set(9 + i * defaultPieces.length, 'lightgrey');
    pieceColours.set(10 + i * defaultPieces.length, 'aqua');
    pieceColours.set(11 + i * defaultPieces.length, 'maroon');
    pieceColours.set(12 + i * defaultPieces.length, 'green');
    pieceColours.set(13 + i * defaultPieces.length, 'indigo');
    pieceColours.set(14 + i * defaultPieces.length, 'dodgerblue');
    pieceColours.set(15 + i * defaultPieces.length, 'lightsteelblue');
    pieceColours.set(16 + i * defaultPieces.length, 'mediumpurple');
    
}

const row = '<td class="legionCell"></td>'.repeat(legionBoard[0].length);
for (let i = 0; i < legionBoard.length; i++) {
    document.querySelector('#legionBoard tbody').innerHTML += `<tr>${row}</tr>`;
}

for (let i = 0; i < defaultPieces.length; i++) {
    let row = '<td class="pieceCell"></td>'.repeat(defaultPieces[i][0].length);
    let grid = `<tr>${row}</tr>`.repeat(defaultPieces[i].length);
    document.querySelector('#pieceForm form').innerHTML += `<div>
        <label for="piece${i+1}">
            <table id="pieceDisplay${i+1}">
                <tbody>${grid}</tbody> 
            </table>
        </label>
        <input id="piece${i+1}" type="number" min=0 value=0>
    </div>`;

    document.getElementById(`pieceDisplay${i+1}`).style.borderCollapse = 'collapse';
    document.getElementById(`pieceDisplay${i+1}`).style.borderSpacing = '0';

    for (let j = 0; j < defaultPieces[i].length; j++) {
        for (let k = 0; k < defaultPieces[i][j].length; k++) {
            if (defaultPieces[i][j][k] != 0) {
                document.getElementById(`pieceDisplay${i+1}`)
                .getElementsByTagName("tr")[j]
                .getElementsByTagName("td")[k].style.background = pieceColours.get(i+1);
            }
        }
    }
}

document.getElementById('pieceForm').addEventListener("input", updateCurrentPieces);

let legionGroups = [];
for (let i = 0; i < 16; i++) {
    legionGroups[i] = [];
}

for (let i = 0; i < legionBoard.length / 4; i++) {
    for (let j = i; j < legionBoard.length / 2; j++) {
        legionGroups[0].push(new Point(j, i));
        legionGroups[1].push(new Point(i, j + 1))
        legionGroups[2].push(new Point(i, legionBoard[0].length - 2 - j))
        legionGroups[3].push(new Point(j, legionBoard[0].length - 1 - i))
        legionGroups[4].push(new Point(legionBoard.length - 1 - j, legionBoard[0].length - 1 - i))
        legionGroups[5].push(new Point(legionBoard.length - 1 - i, legionBoard[0].length - 2 - j))
        legionGroups[6].push(new Point(legionBoard.length - 1 - i, j + 1))
        legionGroups[7].push(new Point(legionBoard.length - 1 - j, i))
    }
}

for (let i = legionBoard.length / 4; i < legionBoard.length / 2; i++) {
    for (let j = i; j < legionBoard.length / 2; j++) {
        legionGroups[8].push(new Point(j, i));
        legionGroups[9].push(new Point(i, j + 1));
        legionGroups[10].push(new Point(3 * legionBoard.length / 4 - 1 - j, legionBoard.length / 4 + 1 + i));
        legionGroups[11].push(new Point(j, legionBoard[0].length - 1 - i));
        legionGroups[12].push(new Point(legionBoard.length - 1 - j, legionBoard[0].length - 1 - i));
        legionGroups[13].push(new Point(j + legionBoard.length / 4, i + legionBoard.length / 4 + 1));
        legionGroups[14].push(new Point(j + legionBoard.length / 4, 3 * legionBoard.length / 4 - i));
        legionGroups[15].push(new Point(legionBoard.length - j - 1, i));
    }
}


for (let i = 0; i < legionBoard[0].length / 2; i++) {
    getLegionCell(i, i).style.borderTopWidth = '3px';
    getLegionCell(i, i).style.borderRightWidth = '3px';
    getLegionCell(legionBoard.length - i - 1, i).style.borderBottomWidth = '3px';
    getLegionCell(legionBoard.length - i - 1, i).style.borderRightWidth = '3px';
    getLegionCell(i, legionBoard[0].length - i - 1).style.borderTopWidth = '3px';
    getLegionCell(i, legionBoard[0].length - i - 1).style.borderLeftWidth = '3px';
    getLegionCell(legionBoard.length - i - 1, legionBoard[0].length - i - 1).style.borderBottomWidth = '3px';
    getLegionCell(legionBoard.length - i - 1, legionBoard[0].length - i - 1).style.borderLeftWidth = '3px';
}

for (let i = 0; i < legionBoard.length; i++) {
    getLegionCell(i, 0).style.borderLeftWidth = '3px';
    getLegionCell(i, legionBoard[0].length / 2).style.borderLeftWidth = '3px';
    getLegionCell(i, legionBoard[0].length - 1).style.borderRightWidth = '3px';
}

for (let i = 0; i < legionBoard[0].length; i++) {
    getLegionCell(0, i).style.borderTopWidth = '3px';
    getLegionCell(legionBoard.length / 2, i).style.borderTopWidth = '3px';
    getLegionCell(legionBoard.length - 1, i).style.borderBottomWidth = '3px';
}

for (let i = legionBoard.length / 4; i < 3 * legionBoard.length / 4; i++) {
    getLegionCell(i, Math.floor(legionBoard[0].length / 4)).style.borderLeftWidth = '3px';
    getLegionCell(i, Math.floor(3 * legionBoard[0].length / 4)).style.borderRightWidth = '3px';
}

for (let i = Math.ceil(legionBoard[0].length / 4); i < Math.floor(3 * legionBoard[0].length / 4); i++) {
    getLegionCell(legionBoard.length / 4, i).style.borderTopWidth = '3px';
    getLegionCell(3 * legionBoard.length / 4, i).style.borderTopWidth = '3px';   
}

let currentPieces = 0;
let boardFilled = 0;

function updateCurrentPieces() {
    currentPieces = 0;
    for (let i = 1; i < 4; i++) {
        if (document.getElementById(`piece${i}`).value != "") {
            currentPieces += i * parseInt(document.getElementById(`piece${i}`).value);
        }
    }
    if (document.getElementById(`piece4`).value != "") {
        currentPieces += parseInt(3 * document.getElementById(`piece4`).value);
    }

    for (let i = 5; i < 10; i++) {
        if (document.getElementById(`piece${i}`).value != "") {
            currentPieces += parseInt(4 * document.getElementById(`piece${i}`).value);
        }
    }
    for (let i = 10; i < 17; i++) {
        if (document.getElementById(`piece${i}`).value != "") {
            currentPieces += parseInt(5 * document.getElementById(`piece${i}`).value);
        }
    }

    document.getElementById('currentPieces').innerText = `Spaces to be Filled: ${currentPieces}`;
}

const states = {
    START: 'start',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
}

let state = states.START;
let isBigClick = false;
let isLiveSolve = false;

document.getElementById("bigClick").addEventListener("click", activateBigClick);
document.getElementById("liveSolve").addEventListener("click", activateLiveSolve);

function activateBigClick() {
    isBigClick = !isBigClick;
}

function activateLiveSolve() {
    isLiveSolve = !isLiveSolve;
    if (isLiveSolve) {
        colourBoard();
    }
}

function getLegionCell(i, j) {
    return document.getElementById("legionBoard")
    .getElementsByTagName("tr")[i]
    .getElementsByTagName("td")[j];
}

function findGroupNumber(i, j) {
    for (let k = 0; k < legionGroups.length; k++) {
        for (let point of legionGroups[k]) {
            if (point.x == i && point.y == j) {
                return k;
            }
        }
    }
}

function clickBoard(i, j) {
    if (state != states.START) {
        return;
    }
    if (isBigClick) {
        if (legionBoard[i][j] == -1) {
            for (let point of legionGroups[findGroupNumber(i, j)]) {
                let grid = getLegionCell(point.x, point.y);
                grid.style.background = 'grey';
                if (legionBoard[point.x][point.y] == -1) {
                    boardFilled++;
                }
                legionBoard[point.x][point.y] = 0;
            }
        } else {
            for (let point of legionGroups[findGroupNumber(i, j)]) {
                let grid = getLegionCell(point.x, point.y);
                grid.style.background = 'white';
                if (legionBoard[point.x][point.y] == 0) {
                    boardFilled--;
                }
                legionBoard[point.x][point.y] = -1;
            }
        }
    } else {
        let grid = getLegionCell(i, j);
        if (legionBoard[i][j] == 0) {
            legionBoard[i][j] = -1;
            grid.style.background = 'white';
            boardFilled--;
        } else {
            legionBoard[i][j] = 0;
            grid.style.background = 'grey';
            boardFilled++;
        }
    }

    document.getElementById('boardFilled').innerText = `Board Spaces Filled: ${boardFilled}`;
}

function hoverOverBoard(i, j) {
    if (state != states.START) {
        return;
    }
    if (isBigClick) {
        for (let point of legionGroups[findGroupNumber(i, j)]) {
            if (legionBoard[point.x][point.y] == -1) {
                getLegionCell(point.x, point.y).style.background = 'silver';
            } else {
                getLegionCell(point.x, point.y).style.background = 'dimgrey';
            }

        }
    } else {
        if (legionBoard[i][j] == -1) {
            getLegionCell(i, j).style.background = 'silver';
        } else {
            getLegionCell(i, j).style.background = 'dimgrey';
        }

    }
} 

function hoverOffBoard(i, j) {
    if (state != states.START) {
        return;
    }
    if (isBigClick) {
        for (let point of legionGroups[findGroupNumber(i, j)]) {
            if (legionBoard[point.x][point.y] == -1) {
                getLegionCell(point.x, point.y).style.background = 'white';
            } else {
                getLegionCell(point.x, point.y).style.background = 'grey';
            }
        }
    } else {
        if (legionBoard[i][j] == -1) {
            getLegionCell(i, j).style.background = 'white';
        } else {
            getLegionCell(i, j).style.background = 'grey';
        }
        
    }
}

function resetBoard() {
    state = states.START;
    for (let i = 0; i < legionBoard.length; i++) {
        for (let j = 0; j < legionBoard[0].length; j++) {
            if (legionBoard[i][j] > 0) {
                getLegionCell(i, j).style.background = 'grey';
                legionBoard[i][j] = 0;
            }
        }
    }
}

for (let i = 0; i < legionBoard.length; i++) {
    for (let j = 0; j < legionBoard[0].length; j++) {
        let grid = getLegionCell(i, j)
        grid.addEventListener("click", function() {clickBoard(i, j);});
        grid.addEventListener("mouseover", function() {hoverOverBoard(i, j)});
        grid.addEventListener("mouseout", function() {hoverOffBoard(i, j)});
        grid.style.background = 'white';
    }
}


document.getElementById("startReset").addEventListener("click", startReset);

async function startReset(evt) {
    if (evt.target.innerText == "Start") {
        evt.target.innerText = "Reset";
        evt.target.disabled = true;
        let success = await runSolver();
        evt.target.disabled = false;
        if (!success) {
            document.getElementById("failText").innerText = "No Solution Exists";
        }
    } else {
        resetBoard();
        document.getElementById("failText").innerText = "";
        evt.target.innerText = "Start";
    }
}

function colourBoard() {
    let spot;

    for (let i = 0; i < legionBoard.length; i++) {
        for (let j = 0; j < legionBoard[0].length; j++) {
            spot = legionBoard[i][j];
            getLegionCell(i, j).style.background = pieceColours.get(spot);
        }
    }
}

function onBoardUpdated() {
    if (isLiveSolve) {
        colourBoard();
    }
}

async function runSolver() {
    amounts = [];
    state = states.IN_PROGRESS;
    for (let i = 0; i < defaultPieces.length; i++) {
        let input = document.getElementById(`piece${i+1}`).value;
        if (input == "") {
            input = 0;
        }
        amounts.push(input);
    }

    for (let i = 0; i < defaultPieces.length; ++i){
        pieces[i] = new Piece(defaultPieces[i], amounts[i], i + 1);
    }
    
    if (boardFilled == 0 && currentPieces > 0) {
        return false;
    }

    let legionSolver = new LegionSolver(legionBoard, pieces, onBoardUpdated);
    console.time("solve");
    let success = await legionSolver.solve();
    console.timeEnd("solve");
    console.log("iterations: " + legionSolver.iterations);
    if (success) {
        colourBoard();
    }
    state = states.COMPLETED;
    return success;
}
