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

let fill = JSON.parse(localStorage.getItem("pieceStorage"))
if (fill) {
    for (let i = 0; i < defaultPieces.length; i++) {
        document.getElementById(`piece${i+1}`).value = fill[i];
    }
}

export { pieceColours, defaultPieces };