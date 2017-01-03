/* global getActiveTabUrl, guid, hideBrowserActionPopup, loadLocalizedResources, localizedPhrases, resizePopup, getSource, sendMessageToExtension */
'use strict';

function openPopupWindow(win, url, windowName, width, height, style) {
    var left = ((screen.width / 2) - (width / 2));
    var top = ((screen.height / 2) - (height / 2));
    var params = style + ', width=' + width + 'px, height=' + height + 'px, top=' + top + ', left=' + left;
    var newWindow = win.open(url, windowName, params);
    newWindow.focus();

    return newWindow;
}

function shareOnSkype(win, guid) {
    getActiveTabUrl(function (activeTabUrl) {
        openPopupWindow(
            win,
            'https://web.skype.com/share?' + 'url=' + encodeURIComponent(activeTabUrl) +
            '&source=' + getSource() + '&flowId=' + guid,
            localizedPhrases['SHARE_ON_SKYPE_WINDOW_TITLE'], 321, 704, 'scrollbars=1, status=0, menubar=0, toolbar=0, resizable=yes');
        sendMessageToExtension({
            op: 'MENU_OPTION_CLICK',
            option: 'Share',
            url: activeTabUrl
        },
        function () {
            hideBrowserActionPopup(win);
        });
    });
}

function launchSkype(win) {
    getActiveTabUrl(function (activeTabUrl) {
        openPopupWindow(
            win,
            'https://web.skype.com/?source=extension',
            'Skype',
            Math.floor(screen.width * 0.75),
            Math.floor(screen.height * 0.80),
            'scrollbars=1, status=0, menubar=0, toolbar=0, resizable=yes');
        sendMessageToExtension({
            op: 'MENU_OPTION_CLICK',
            option: 'LaunchClient',
            url: activeTabUrl
        },
        function () {
            hideBrowserActionPopup(win);
        });
    });
}

function localize(doc) {
    var localizables = doc.getElementsByClassName('loc'),
        localizable, localized;

    loadLocalizedResources();

    for (var i = localizables.length - 1; i >= 0; i--) {
        localizable = localizables[i];
        localized = localizedPhrases[localizable.text.trim()];
        if (localized) {
            localizable.text = localized;
        }
    }
}

function onMenuItemMouseOver (event, menuItems) {
    for (var i = menuItems.length - 1; i >= 0; i--) {
        if (menuItems[i].classList.contains('highlighted')) {
            menuItems[i].classList.remove('highlighted');
        }
    }
    event.target.parentElement.classList.add('highlighted');
}

document.onreadystatechange = function () {
    var menuItems, i;
    if (document.readyState === 'complete') {
        localize(document);
        resizePopup();
        document.getElementById('shareOnSkypeLink').addEventListener('click', function () {
            shareOnSkype(window, guid.createRaw());
        });
        document.getElementById('launchSkypeLink').addEventListener('click', function () {
            launchSkype(window);
        });
        menuItems = document.getElementsByClassName('menuItem');
        for (var i = menuItems.length - 1; i >= 0; i--) {
            menuItems[i].addEventListener('mouseover', function (event) {onMenuItemMouseOver(event, menuItems);});
        }
    }
};
