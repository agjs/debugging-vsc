'use strict';

var guid = {};

function formatAsHex(n) {
    var hex = n.toString(16),
        padding = 4 - hex.length,
        i;

    for (i = 0; i < padding; i += 1) {
        hex = '0' + hex;
    }
    return hex;
}

function generate() {
    var r = new Array(8),
        val,
        i;

    for (i = 0; i < r.length; i += 2) {
        val = Math.floor(Math.random() * 0x100000000);
        r[i] = formatAsHex(val & 0xFFFF);
        r[i + 1] = formatAsHex(val >>> 16);

        if ((i + 1) === 3) {
            // RFC4122 requires a 4 in this position
            r[i + 1] = '4' + r[i + 1].substring(1);
        }
    }
    return r;
}

guid.createRaw = function () {
    var r = generate();
    return r[0] + r[1] + r[2] + r[3] +
        r[4] + r[5] + r[6] + r[7];
};

