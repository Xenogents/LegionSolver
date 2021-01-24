import locales from './locales/index.js';

let _cr = getCurrentLanguage();

function getCurrentLanguage() {
    const region = getRegionByBrowserLanguage();

    // default: GMS
    return localStorage.getItem('i18n') || region || 'GMS';
}

function getRegionByBrowserLanguage() {
    const language = window.navigator.userLanguage || window.navigator.language;
    let resultRegion;

    switch (language) {
        case 'en': resultRegion = 'GMS'; break;
        case 'ko': resultRegion = 'KMS'; break;
        case 'ja': resultRegion = 'JMS'; break;

        default: resultRegion = null; break;
    }

    return resultRegion;
}

function setCurrentLanguage() {
    document.getElementById(_cr).selected = true;
}

function i18n(key) {
    return locales[_cr][key];
}

document.getElementById('title').textContent = i18n('title');
getTextNodesIn(document.getElementById('instructions'))[0].textContent = i18n('instructions');
getTextNodesIn(document.getElementById('paragraph'))[0].textContent = i18n('instructionsSub1');
getTextNodesIn(document.getElementById('paragraph'))[1].textContent = i18n('instructionsSub2');
getTextNodesIn(document.getElementById('paragraph'))[2].textContent = i18n('instructionsSub3');
getTextNodesIn(document.getElementById('paragraph'))[3].textContent = i18n('instructionsSub4');
getTextNodesIn(document.getElementById('currentPieces'))[0].textContent = i18n('spacesToBeFilled');
getTextNodesIn(document.getElementById('boardFilled'))[0].textContent = i18n('boardSpacesFilled');
getTextNodesIn(document.getElementById('iterations'))[0].textContent = i18n('iterations');
getTextNodesIn(document.getElementById('time'))[0].textContent = i18n('time');

document.querySelector('label[for="bigClick"]').textContent = i18n('bigClick');
document.querySelector('label[for="liveSolve"]').textContent = i18n('liveSolve');
document.querySelector('label[for="darkMode"]').textContent = i18n('darkMode');

document.getElementById('boardButton').textContent = i18n('start');
document.getElementById('resetButton').textContent = i18n('reset');
document.getElementById('clearPieces').textContent = i18n('clearPieces');
document.getElementById('clearBoard').textContent = i18n('clearBoard');
document.getElementById('failText').textContent = i18n('failText');

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

document.getElementById("languageSelectBox").addEventListener("change", function () {
    localStorage.setItem('i18n', this.value);
    location.reload();
});

setCurrentLanguage();

export { i18n, getCurrentLanguage };
