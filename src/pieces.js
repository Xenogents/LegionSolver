import { Piece } from './modules/piece.js';
import { sumBy } from 'lodash';
import { i18n, getCurrentLanguage } from './i18n.js';

// TODO: Remove extra 2s.

const defaultPieces = [
    // Lvl 60
    [
        [2]
    ],

    // Lvl 100
    [
        [2, 2]
    ],

    // Lvl 140 Warrior/Pirate
    [
        [1, 0],
        [2, 1]
    ],

    // Lvl 140 Mage/Thief/Archer
    [
        [1, 2, 1]
    ],

    // Lvl 200 Warrior
    [
        [2, 2],
        [2, 2]
    ],

    // Lvl 200 Archer
    [
        [1, 2, 2, 1]
    ],

    // Lvl 200 Thief/Lab
    [
        [1, 0, 0],
        [1, 2, 1]
    ],

    // Lvl 200 Mage
    [
        [0, 1, 0],
        [1, 2, 1]
    ],

    // Lvl 200 Pirate
    [
        [1, 2, 0],
        [0, 2, 1]
    ],

    // Lvl 250 Warrior
    [
        [1, 1, 2],
        [0, 1, 1]
    ],

    // Lvl 250 Archer
    [
        [1, 1, 2, 1, 1],
    ],

    // Lvl 250 Thief
    [
        [0, 0, 1],
        [1, 2, 1],
        [0, 0, 1]
    ],

    // Lvl 250 Mage
    [
        [0, 1, 0],
        [1, 2, 1],
        [0, 1, 0]
    ],

    // Lvl 250 Pirate
    [
        [1, 2, 0, 0],
        [0, 1, 1, 1]
    ],

    // Lvl 250 Xenon
    [
        [1, 1, 0],
        [0, 2, 0],
        [0, 1, 1]
    ],
];

const gmsPieces = [
    // Lvl 200 Enhanced Lab
    [
        [1, 0, 0, 0],
        [0, 1, 2, 1]
    ],

    // Lvl 250 Enhanced Lab
    [
        [1, 0, 0, 0, 1],
        [0, 1, 2, 1, 0]
    ],

    // Lvl 250 Lab
    [
        [1, 0, 1],
        [1, 2, 1]
    ],
];

const pieces = []
for (let piece of defaultPieces){
    pieces.push(Piece.createPiece(piece, 0));
}

function hasLabPieces() {
    return !!['GMS', 'TMS'].find(lang => lang === getCurrentLanguage());
}

if (hasLabPieces()) {
    for (let piece of gmsPieces){
        pieces.push(Piece.createPiece(piece, 0));
    }
}

let pieceColours = new Map();
pieceColours.set(-1, 'white');
pieceColours.set(0, 'grey');
for (let i = 0; i < 2; i++) {
    pieceColours.set(1 + i * 18, 'lightpink');
    pieceColours.set(2 + i * 18, 'lightcoral');
    pieceColours.set(3 + i * 18, 'indianred');
    pieceColours.set(4 + i * 18, 'darkseagreen');
    pieceColours.set(5 + i * 18, 'firebrick');
    pieceColours.set(6 + i * 18, 'mediumseagreen');
    pieceColours.set(7 + i * 18, 'purple');
    pieceColours.set(8 + i * 18, 'dodgerblue');
    pieceColours.set(9 + i * 18, 'lightsteelblue');
    pieceColours.set(10 + i * 18, 'maroon');
    pieceColours.set(11 + i * 18, 'green');
    pieceColours.set(12 + i * 18, 'indigo');
    pieceColours.set(13 + i * 18, 'blue');
    pieceColours.set(14 + i * 18, 'cadetblue');
    pieceColours.set(15 + i * 18, 'mediumpurple');
    pieceColours.set(16 + i * 18, 'aquamarine');
    pieceColours.set(17 + i * 18, 'aquamarine');
    pieceColours.set(18 + i * 18, 'aquamarine');
}

for (let i = 0; i < pieces.length; i++) {
    let row = '<td class="pieceCell"></td>'.repeat(pieces[i].shape[0].length);
    let grid = `<tr>${row}</tr>`.repeat(pieces[i].shape.length);
    document.querySelector('#pieceForm form').innerHTML += `<div class="piece">
        <div id="pieceDescription${i+1}"></div>
        <label for="piece${i+1}">
            <table id="pieceDisplay${i+1}">
                <tbody>${grid}</tbody>
            </table>
        </label>
        <input id="piece${i+1}" type="number" min=0 value=0>
    </div>`;

    document.getElementById(`pieceDisplay${i+1}`).style.borderCollapse = 'collapse';
    document.getElementById(`pieceDisplay${i+1}`).style.borderSpacing = '0';
    document.getElementById(`pieceDescription${i+1}`).style.paddingRight = '15px';

    for (let j = 0; j < pieces[i].shape.length; j++) {
        for (let k = 0; k < pieces[i].shape[j].length; k++) {
            if (pieces[i].shape[j][k] != 0) {
                document.getElementById(`pieceDisplay${i+1}`)
                .getElementsByTagName("tr")[j]
                .getElementsByTagName("td")[k].style.background = pieceColours.get(i+1);
            }
        }
    }
}

document.getElementById('pieceDescription1').textContent = i18n('lvl60');
document.getElementById('pieceDescription2').textContent = i18n('lvl100');
document.getElementById('pieceDescription3').textContent = i18n('warriorPirate140');
document.getElementById('pieceDescription4').textContent = i18n('mageThiefArcher140');
document.getElementById('pieceDescription5').textContent = i18n('warrior200');
document.getElementById('pieceDescription6').textContent = i18n('archer200');
document.getElementById('pieceDescription7').textContent = i18n('thiefLab200');
document.getElementById('pieceDescription8').textContent = i18n('mage200');
document.getElementById('pieceDescription9').textContent = i18n('pirate200');
document.getElementById('pieceDescription10').textContent = i18n('warrior250');
document.getElementById('pieceDescription11').textContent = i18n('archer250');
document.getElementById('pieceDescription12').textContent = i18n('thief250');
document.getElementById('pieceDescription13').textContent = i18n('mage250');
document.getElementById('pieceDescription14').textContent = i18n('pirate250');
document.getElementById('pieceDescription15').textContent = i18n('xenon250');

if (hasLabPieces()) {
    document.getElementById('pieceDescription16').textContent = i18n('enhancedLab200');
    document.getElementById('pieceDescription17').textContent = i18n('enhancedLab250');
    document.getElementById('pieceDescription18').textContent = i18n('lab250');
}

let currentPieces = 0;
let currentUseCaracterCount = 0;
if (localStorage.getItem("currentPieces")) {
    currentPieces = JSON.parse(localStorage.getItem("currentPieces"));
    document.getElementById('currentPiecesValue').innerText = `${currentPieces}`;
}

let pieceAmounts = JSON.parse(localStorage.getItem("pieceAmounts"))
if (pieceAmounts) {
    for (let i = 0; i < pieces.length; i++) {
        document.getElementById(`piece${i+1}`).value = pieceAmounts[i] || 0;
    }

    updateCurrentPieces();
}

document.getElementById('pieceForm').addEventListener("input", updateCurrentPieces);

function updateCurrentPieces() {
    for (let piece of pieces) {
        piece.amount = parseInt(document.getElementById(`piece${piece.id}`).value) || 0;
    }

    currentPieces = sumBy(pieces, piece => piece.cellCount * piece.amount);
    currentUseCaracterCount = sumBy(pieces, (piece) => piece.amount);

    localStorage.setItem("pieceAmounts", JSON.stringify(pieces.map(piece => piece.amount)));
    localStorage.setItem("currentPieces", JSON.stringify(currentPieces));

    document.getElementById('currentPiecesValue').innerText = `${currentPieces}`;
    document.getElementById("currentCaracterCountValue").innerText = `${currentUseCaracterCount}`;
}

document.getElementById("clearPieces").addEventListener("click", clearPieces);

function clearPieces() {
    for (let i = 0; i < pieces.length; i++) {
        document.getElementById(`piece${i+1}`).value = 0;
    }

    updateCurrentPieces();
}

export { pieceColours, pieces };