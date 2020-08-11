import i18n from './i18n/index';

export default {
    getCurrentLanguage
}

let _cr = getCurrentLanguage();

function getCurrentLanguage() {
    // default: GMS
    return localStorage.getItem('i18n') || 'GMS';
}

function setCurrentLanguage() {
    document.getElementById(_cr).selected = true;
}

async function makeDelay() {
    new Promise ((resolve) => {
        setTimeout(() => {
            resolve();
        });
    });
}

async function conversionLanguage() {
    getTextNodesIn(document.getElementById('title'))[0].textContent = i18n[_cr]['title'];
    getTextNodesIn(document.getElementById('instructions'))[0].textContent = i18n[_cr]['instructions'];
    getTextNodesIn(document.getElementById('paragraph'))[0].textContent = i18n[_cr]['instructionsSub1'];
    getTextNodesIn(document.getElementById('paragraph'))[1].textContent = i18n[_cr]['instructionsSub2'];
    getTextNodesIn(document.getElementById('paragraph'))[2].textContent = i18n[_cr]['instructionsSub3'];
    getTextNodesIn(document.getElementById('paragraph'))[3].textContent = i18n[_cr]['instructionsSub4'];
    getTextNodesIn(document.getElementById('currentPieces'))[0].textContent = i18n[_cr]['spacesToBeFilled'];
    getTextNodesIn(document.getElementById('boardFilled'))[0].textContent = i18n[_cr]['boardSpacesFilled'];
    getTextNodesIn(document.getElementById('iterations'))[0].textContent = i18n[_cr]['iterations'];
    getTextNodesIn(document.getElementById('time'))[0].textContent = i18n[_cr]['time'];

    document.querySelector('label[for="bigClick"]').textContent = i18n[_cr]['bigClick'];
    document.querySelector('label[for="liveSolve"]').textContent = i18n[_cr]['liveSolve'];
    document.querySelector('label[for="darkMode"]').textContent = i18n[_cr]['darkMode'];

    document.getElementById('boardButton').textContent = i18n[_cr]['boardButton'];
    document.getElementById('resetButton').textContent = i18n[_cr]['resetButton'];
    document.getElementById('clearPieces').textContent = i18n[_cr]['clearPieces'];
    document.getElementById('clearBoard').textContent = i18n[_cr]['clearBoard'];
    document.getElementById('failText').textContent = i18n[_cr]['failText'];

    document.getElementById('pieceDescription1').textContent = i18n[_cr]['lvl60'];
    document.getElementById('pieceDescription2').textContent = i18n[_cr]['lvl100'];
    document.getElementById('pieceDescription3').textContent = i18n[_cr]['warriorPirate140'];
    document.getElementById('pieceDescription4').textContent = i18n[_cr]['mageThiefArcher140'];
    document.getElementById('pieceDescription5').textContent = i18n[_cr]['warrior200'];
    document.getElementById('pieceDescription6').textContent = i18n[_cr]['archer200'];
    document.getElementById('pieceDescription7').textContent = i18n[_cr]['thiefLab200'];
    document.getElementById('pieceDescription8').textContent = i18n[_cr]['mage200'];
    document.getElementById('pieceDescription9').textContent = i18n[_cr]['pirate200'];
    document.getElementById('pieceDescription11').textContent = i18n[_cr]['warrior250'];
    document.getElementById('pieceDescription12').textContent = i18n[_cr]['archer250'];
    document.getElementById('pieceDescription13').textContent = i18n[_cr]['thief250'];
    document.getElementById('pieceDescription14').textContent = i18n[_cr]['mage250'];
    document.getElementById('pieceDescription15').textContent = i18n[_cr]['pirate250'];
    document.getElementById('pieceDescription16').textContent = i18n[_cr]['xenon250'];

    /** local limited jobs */
    if (_cr === 'GMS') {
        document.getElementById('pieceDescription10').parentElement.style.display = 'flex';
        document.getElementById('pieceDescription17').parentElement.style.display = 'flex';
        document.getElementById('pieceDescription18').parentElement.style.display = 'flex';

        document.getElementById('pieceDescription10').textContent = i18n[_cr]['enhancedLab250'];
        document.getElementById('pieceDescription17').textContent = i18n[_cr]['enhancedLab200'];
        document.getElementById('pieceDescription18').textContent = i18n[_cr]['lab250'];
    } else if (_cr === 'KMS') {
        document.getElementById('pieceDescription10').parentElement.style.display = 'none';
        document.getElementById('pieceDescription17').parentElement.style.display = 'none';
        document.getElementById('pieceDescription18').parentElement.style.display = 'none';
    }
}

function getTextNodesIn(node, includeWhitespaceNodes) {
    const textNodes = [], whitespace = /^\s*$/;

    function getTextNodes(node) {
        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
                textNodes.push(node);
            }
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                getTextNodes(node.childNodes[i]);
            }
        }
    }

    getTextNodes(node);

    return textNodes;
}

document.getElementById('languageSelectBox').onchange = function () {
    const index = this.selectedIndex;
    const selectLanguage = this.children[index].innerHTML.trim();

    localStorage.setItem('i18n', selectLanguage);

    _cr = selectLanguage;

    conversionLanguage();
}

setCurrentLanguage();
conversionLanguage();