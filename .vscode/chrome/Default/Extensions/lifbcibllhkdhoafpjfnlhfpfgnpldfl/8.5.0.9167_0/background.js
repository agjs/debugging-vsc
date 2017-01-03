/* globals SkypeC2CTelemetry */
/**
This is the script run when the browser starts up and is not associated
with any tab. Here we create a add-on icon in the add-on bar to display
the options.
*/
'use strict';
/**
* Returns the product version number
*
* @return Product version number
*/
var getProductVersion = function() {
    return '8.5.0.9167';
};

var openFaqTab = function() {
    chrome.tabs.create({
        url: 'https://go.skype.com/skype.extension.faq'
    });
};

var firstLaunchExperience = function() {
    var previousVersion = localStorage.getItem('skype_version');
    var newVersion = getProductVersion();
    if (!previousVersion){
        openFaqTab();
    } else {
        var newMajorVersion = parseInt(newVersion.split('.')[0], 10);
        var previousMajorVersion = parseInt(previousVersion.split('.')[0], 10);
        if (newMajorVersion && previousMajorVersion && (newMajorVersion > previousMajorVersion)) {
            openFaqTab();
        }
    }
    localStorage.setItem('skype_version', getProductVersion());
};


/**
* Stores configuration information
*/
var Configuration = {
    configReady: '0',
    fingerPrint : '0',
    metricsUrl: 'https://pipe.skype.com/Client/2.0/',
    uiId : 0
};

/**
* Sends metrics data
*/
var postMetrics = function(event, userKVPs) {

    if ( event === 'extension_state' ) {
        SkypeC2CTelemetry.post( Configuration.metricsUrl,
            event,
            false, {
                Fingerprint: Configuration.fingerPrint,
                UiId: Configuration.uiId.toString(),
                ReferrerUrl: userKVPs.url,
                Enabled: userKVPs.chosenFunction
            }
        );
    }
};

/**
* Main function where all the action starts
*/
var main = function() {
    firstLaunchExperience();
    
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    	if ( request.op === 'MENU_OPTION_CLICK') {
    		var data = {
                     chosenFunction: request.option,
                     url: request.url.split('?')[0].split('#')[0]
                 };
    		postMetrics('extension_state', data);
    	}
    });
};

main();
