import './styles.css';
import { Piece } from './modules/piece.js';
import { Point } from './modules/point.js';
import { LegionSolver } from './modules/legion_solver.js';
import { LegionBoard } from './modules/board.js';

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

let legionBoard = new LegionBoard(board);

const row = '<td class="legionCell"></td>'.repeat(legionBoard.board[0].length);
for (let i = 0; i < legionBoard.board.length; i++) {
    document.querySelector('#legionBoard tbody').innerHTML += `<tr>${row}</tr>`;
}

legionBoard.setLegionBorders();
legionBoard.setLegionGroups();

for (let i = 0; i < defaultPieces.length; i++) {
    let row = '<td class="pieceCell"></td>'.repeat(defaultPieces[i][0].length);
    let grid = `<tr>${row}</tr>`.repeat(defaultPieces[i].length);
    document.querySelector('#pieceForm form').innerHTML += `<div class="piece">
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
                .getElementsByTagName("td")[k].style.background = legionBoard.pieceColours.get(i+1);
            }
        }
    }
}

document.getElementById('pieceForm').addEventListener("input", updateCurrentPieces);

let currentPieces;
if (localStorage.getItem("currentPieces")) {
    currentPieces = JSON.parse(localStorage.getItem("currentPieces"));
    document.getElementById('currentPieces').innerText = `Spaces to be Filled: ${currentPieces}`;
} else {
    currentPieces = 0;
}

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

    let pieceStorage = [];
    for (let i = 0; i < defaultPieces.length; i++) {
        if (document.getElementById(`piece${i+1}`).value == "") {
            pieceStorage.push("0");  
        }
        pieceStorage.push(document.getElementById(`piece${i+1}`).value);
    }
    localStorage.setItem("pieceStorage", JSON.stringify(pieceStorage));
    localStorage.setItem("currentPieces", JSON.stringify(currentPieces));
    document.getElementById('currentPieces').innerText = `Spaces to be Filled: ${currentPieces}`;
}

document.getElementById("clearPieces").addEventListener("click", clearPieces);

function clearPieces() {
    let pieceStorage = []
    for (let i = 0; i < defaultPieces.length; i++) {
        document.getElementById(`piece${i+1}`).value = JSON.parse(0);
        pieceStorage.push("0");
    }
    currentPieces = 0;
    localStorage.setItem("pieceStorage", JSON.stringify(pieceStorage));
    localStorage.setItem("currentPieces", JSON.stringify(0));
    document.getElementById('currentPieces').innerText = `Spaces to be Filled: ${currentPieces}`;
}

for (let i = 0; i < legionBoard.board.length; i++) {
    for (let j = 0; j < legionBoard.board[0].length; j++) {
        let grid = legionBoard.getLegionCell(i, j)
        grid.addEventListener("click", function() {legionBoard.clickBoard(i, j);});
        grid.addEventListener("mouseover", function() {legionBoard.hoverOverBoard(i, j)});
        grid.addEventListener("mouseout", function() {legionBoard.hoverOffBoard(i, j)});
        grid.style.background = 'white';
    }
}

document.getElementById("startReset").addEventListener("click", startReset);

async function startReset(evt) {
    if (evt.target.innerText == "Start") {
        evt.target.innerText = "Reset";
        evt.target.disabled = true;
        document.getElementById("clearBoard").disabled = true;
        let success = await runSolver();
        evt.target.disabled = false;
        if (!success) {
            document.getElementById("failText").innerText = "No Solution Exists";
        }
    } else {
        document.getElementById("clearBoard").disabled = false;
        document.getElementById("failText").innerText = "";
        evt.target.innerText = "Start";
    }
}

function onBoardUpdated() {
    if (legionBoard.isLiveSolve()) {
        legionBoard.colourBoard();
    }
}

async function runSolver() {
    amounts = [];
    legionBoard.state = legionBoard.states.IN_PROGRESS;
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
    
    if (legionBoard.boardFilled == 0 && currentPieces > 0) {
        return false;
    }

    let legionSolver = new LegionSolver(legionBoard.board, pieces, onBoardUpdated);
    console.time("solve");
    let success = await legionSolver.solve();
    console.timeEnd("solve");
    console.log("iterations: " + legionSolver.iterations);
    if (success) {
        legionBoard.colourBoard();
    }
    legionBoard.state = legionBoard.states.COMPLETED;
    return success;
}

window.onload = function() {
    legionBoard.colourBoard();
    let fill = JSON.parse(localStorage.getItem("pieceStorage"))
    if (fill) {
        for (let i = 0; i < defaultPieces.length; i++) {
            document.getElementById(`piece${i+1}`).value = fill[i];
        }
    }
}
