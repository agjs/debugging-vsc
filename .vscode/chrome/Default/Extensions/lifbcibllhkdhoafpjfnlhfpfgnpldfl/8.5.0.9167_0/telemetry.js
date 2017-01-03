/**
 * @file SkypeC2CTelemetry.js
 * @brief JS implementation of the telemetry class to send metrics to dataRV.
 */

/* globals getProductVersion */
/* eslint no-unused-vars: [2, { "varsIgnorePattern": "SkypeC2CTelemetry" }]*/
'use strict';

var SkypeC2CTelemetry = {

    formatAsHex : function (n) {
        var hex = n.toString(16),
            padding = 4 - hex.length,
            i;

        for (i = 0; i < padding; i++) {
            hex = '0' + hex;
        }

        return hex;
    },

    createGuid : function () {
        var r = new Array(8),
            val,
            i;

        for (i = 0; i < r.length; i += 2) {
            val = Math.floor(Math.random() * 0x100000000);
            r[i] = this.formatAsHex(val & 0xFFFF);
            r[i + 1] = this.formatAsHex(val >>> 16);

            if ((i + 1) === 3) {
                // RFC4122 requires a 4 in this position
                r[i + 1] = '4' + r[i + 1].substring(1);
            }
        }

        return r[0] + r[1] + '-' + r[2] + '-' + r[3] + '-' +
               r[4] + '-' + r[5] + r[6] + r[7];
    },

    createPacket : function(eventType, isPluginSpecific, userPassedKVPs) {
        var guid = this.createGuid();
        var timestamp = new Date().getTime();
        var packet = {
            'data_package_id': guid,
            'timestamp': timestamp,
            'source': 'C2C',
            'version': getProductVersion(),
            'type': 'Service',
            'ids': { 'service_id': '1'},
            'schema': 2,

            'records': [
                {
                    'id': guid,
                    'timestamp': timestamp,
                    'event_type': (( isPluginSpecific ) ? 'C2C_plugin_' : 'C2C_') + eventType,
                    'type': 'browser_metric'
                }
            ]
        };

        packet.records[0].extension = userPassedKVPs;
        packet.records[0].extension.ReferrerUrl = userPassedKVPs.ReferrerUrl || window.location.href.split('?')[0].split('#')[0];

        // If its a local file then make it a fixed path for privacy
        if (packet.records[0].extension.ReferrerUrl.indexOf('file:') === 0) {
            packet.records[0].extension.ReferrerUrl = 'file://localpath';
        }

        packet.records[0].extension.Browser = navigator.userAgent;
        packet.records[0].extension.Component = 'plugin';

        return packet;
    }
};
