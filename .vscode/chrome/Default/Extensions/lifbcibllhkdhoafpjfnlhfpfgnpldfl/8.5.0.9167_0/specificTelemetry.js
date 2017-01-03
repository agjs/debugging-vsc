/* eslint new-cap: 0 */
'use strict';

var SkypeC2CTelemetry = SkypeC2CTelemetry ? SkypeC2CTelemetry : {};

SkypeC2CTelemetry.post = function(endpoint, eventType, isPluginSpecific, userPassedKVPs) {

    if (endpoint === '') {
        return;
    }

    var packet = this.createPacket(eventType, isPluginSpecific, userPassedKVPs);

    var packetStr = JSON.stringify(packet);

    var ajaxReq = new XMLHttpRequest();
    ajaxReq.onreadystatechange = function () {};
    ajaxReq.open('POST', endpoint, true);
    ajaxReq.setRequestHeader('Content-type','application/json');
    ajaxReq.send(packetStr);
};
