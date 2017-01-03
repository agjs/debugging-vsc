'use strict';

/**
* Returns the product version number
*
* @return Product version number
*/
function getProductVersion() {
    return "8.5.0.9167";
}

/*
* Determine the host (domain) part of the URL
* @return Host name (domain) of the URL
*/
function getURLHostName() {
    var hostName = "";
    try {
        hostName = getDocument().location.hostname;
        if(!hostName) { // Can be null for locally loaded pages and sometimes iframes
            hostName = top.window.location.hostname; // Try to get parent window host name (for iframes)
            if(!hostName) {
                hostName = "";
            }
        }
    }
    catch(e) {
        Log("Exception while trying to get URL host name: " + e.message);
        hostName = "";
    }

    return hostName.toLowerCase();
}

/**
* Starts our operations
*/
function main() {
    LogTimestamp("Plugin invoked");

    // Get the URL of the page
    pageUrl = getDocument().location.href;
    Log("Page URL: " + pageUrl);

    // Get the host name (domain) part of the URL
    pageUrlHostName = getURLHostName();
    Log("Page URL host name: " + pageUrlHostName);
}

var languageforUI = "en";
var pageLanguage = "en";
var pageUrl = "";
var pageUrlHostName = "";

Log("Content script loaded");

main();
