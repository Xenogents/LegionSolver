import { Piece } from './modules/piece.js';
import { sumBy } from 'lodash';

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

const pieces = []
for (let i = 0; i < defaultPieces.length; ++i){
    pieces.push(Piece.createPiece(defaultPieces[i], 0));
}

const pieceColours = new Map();
pieceColours.set(-1, 'white');
pieceColours.set(0, 'grey');
for (let i = 0; i < 2; i++) {
    pieceColours.set(1 + i * 16, 'orange');
    pieceColours.set(2 + i * 16, 'lime');
    pieceColours.set(3 + i * 16, 'red');
    pieceColours.set(4 + i * 16, 'limegreen');
    pieceColours.set(5 + i * 16, 'firebrick');
    pieceColours.set(6 + i * 16, 'mediumseagreen');
    pieceColours.set(7 + i * 16, 'purple');
    pieceColours.set(8 + i * 16, 'lightskyblue');
    pieceColours.set(9 + i * 16, 'lightgrey');
    pieceColours.set(10 + i * 16, 'aqua');
    pieceColours.set(11 + i * 16, 'maroon');
    pieceColours.set(12 + i * 16, 'green');
    pieceColours.set(13 + i * 16, 'indigo');
    pieceColours.set(14 + i * 16, 'dodgerblue');
    pieceColours.set(15 + i * 16, 'lightsteelblue');
    pieceColours.set(16 + i * 16, 'mediumpurple');
}

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
                .getElementsByTagName("td")[k].style.background = pieceColours.get(i+1);
            }
        }
    }
}

let currentPieces = 0;
if (localStorage.getItem("currentPieces")) {
    currentPieces = JSON.parse(localStorage.getItem("currentPieces"));
    document.getElementById('currentPieces').innerText = `Spaces to be Filled: ${currentPieces}`;
}

let pieceAmounts = JSON.parse(localStorage.getItem("pieceAmounts"))
if (pieceAmounts) {
    for (let i = 0; i < defaultPieces.length; i++) {
        document.getElementById(`piece${i+1}`).value = pieceAmounts[i];
    }

    updateCurrentPieces();
}

document.getElementById('pieceForm').addEventListener("input", updateCurrentPieces);

function updateCurrentPieces() {
    for (let piece of pieces) {
        piece.amount = parseInt(document.getElementById(`piece${piece.id}`).value) || 0;
    }

    currentPieces = sumBy(pieces, piece => piece.cellCount * piece.amount);

    localStorage.setItem("pieceAmounts", JSON.stringify(pieces.map(piece => piece.amount)));
    localStorage.setItem("currentPieces", JSON.stringify(currentPieces));
    document.getElementById('currentPieces').innerText = `Spaces to be Filled: ${currentPieces}`;
}

document.getElementById("clearPieces").addEventListener("click", clearPieces);

function clearPieces() {
    for (let i = 0; i < defaultPieces.length; i++) {
        document.getElementById(`piece${i+1}`).value = 0;
    }

    updateCurrentPieces();
}

export { pieceColours, pieces };