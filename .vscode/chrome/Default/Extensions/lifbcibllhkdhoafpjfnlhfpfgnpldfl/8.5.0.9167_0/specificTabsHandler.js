/* eslint no-unused-vars: [2, { "varsIgnorePattern": "getActiveTabUrl|hideBrowserActionPopup|resizePopup|getSource|sendMessageToExtension" }]*/
'use strict';

function getActiveTabUrl (callback) {
    chrome.tabs.query(
        {active: true, currentWindow: true},
        function (tabs) {
            var activeTab = tabs[0];
            callback(activeTab.url);
        }
    );
}

function hideBrowserActionPopup (win) {
    win.close();
}

function resizePopup () {
    // Implementation not required for Chrome
}

function getSource () {
    return 'chExtension';
}

function sendMessageToExtension(message, callback) {
    chrome.extension.sendMessage(message, callback);
}
