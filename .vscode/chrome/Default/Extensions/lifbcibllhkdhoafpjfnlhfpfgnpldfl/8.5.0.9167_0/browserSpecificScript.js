'use strict';

// Our extension id is fixed and known because we use the same chrome_ext.pem file
// during the build when making the crx file.
var resourceURL = "chrome-extension://lifbcibllhkdhoafpjfnlhfpfgnpldfl/";

// Pending mutations are processed as per this interval
var MUTATION_PROCESSING_INTERVAL = 250; // Milliseconds

// Time after which mutation processing should stop to 
// relinquish control back to the browser
var MAX_MUTATION_PROCESSING_TIME = 150; // Milliseconds

/**
* Returns the document
*/
function getDocument() {
    return document;
}

/**
 * Returns true if document is HTML
 */
function isHtmlPage() {
    var isHTML = false;

    if (document.doctype && document.doctype.name === "html") {
        isHTML = true;
    } else {
        // Truncate url to get base address without params & hashes
        var url = document.location.href.split("?")[0].split("#")[0];
        // Lets check extension to see if its html
        var htmlExtensions = ["html", "htm"];
        htmlExtensions.forEach(function(ext) {
            if(!isHTML && url.indexOf(ext, url.length - ext.length) !== -1) {
                isHTML = true;
            }
        });
        if (!isHTML && url.indexOf("file:") !== 0) {
            // For remote files check whether document have some scripts or css styles
            isHTML = (document.scripts ? document.scripts.length : 0) +
                (document.styleSheets ? document.styleSheets.length : 0) > 0;
        }
    }
    return isHTML;
}

/**
* Our name
*/
function getPluginName() {
    return "CHROMETB";
}

/**
* Writes a log line to the JS console
*
* @param item - Item to log
*/
function Log(item) {
    //console.log(item);
}

/**
* Writes a timestamp (milliseconds since epoch) and a message to the JS console
* Separate function from Log so that it can be enabled/disabled separately
*/
function LogTimestamp(message) {
    //console.log(performance.now() + " ms since navigationStart: " + message);
}

/**
* Sends a message to the background page requesting settings to be sent
*/
function postSettingsRequest() {
    chrome.extension.sendMessage({op: 'GET_SETTINGS_REQUEST'}, function(message) {
        processSettingsResponse(message);
    });
}

// Register a listener for when background page wants to send us settings changes
// done by the user
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    processSettingsResponse(request);
});
