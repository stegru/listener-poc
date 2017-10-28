"use strict";

var NFC = require("nfc-pcsc").NFC;

var ndef = require("./ndef.js");

var debug = process.argv.indexOf("debug") > -1;

var logger = debug ? {
    log: console.log,
    debug: console.log,
    info: console.log,
    warn: console.log,
    error: console.log
} : null;

var nfc = new NFC(logger);

/**
 *
 * @param reader {Reader}
 * @param apdu {Object}
 * @param apdu.cla {byte} Instruction class (CLA)
 * @param apdu.ins {byte} Instruction code (INS)
 * @param apdu.p1 {byte} Parameter 1 (P1)
 * @param apdu.p2 {byte} Parameter 2 (P2)
 * @param apdu.lc {byte} Command data length (Lc) - optional
 * @param apdu.data {byte|byte[]} Command data - optional
 * @param apdu.le {byte} Response length expected (Le) - optional
 *
 */
function send(reader, apdu) {
    var order = [ "cla", "ins", "p1", "p2", "lc", "data", "le" ];
    var required = [ "cla", "ins", "p1", "p2" ];
    var bytes = [];

    order.forEach(function (field) {
        var gotValue = apdu.hasOwnProperty(field);
        var value = gotValue && apdu[field];
        if (!gotValue && required.indexOf(field) > -1) {
            value = 0x00;
            gotValue = true;
        }


        if (gotValue) {
            if (Array.isArray(value)) {
                bytes.push.apply(bytes, value);
            } else {
                bytes.push(value);
            }
        }
    });

    var maxResponseLength = apdu.le || 0;

    var data = Buffer.from(bytes);
    var promise = reader.transmit(data, maxResponseLength + 2);

    if (debug) {
        promise.then(function (response) {
            console.log("response: ", response);
        });
    }

    return promise;
}

function readBlock(reader, block, len) {
    len = len || 16;
    return authenticateBlock(reader, block).then(function () {
        return send(reader, {
            cla: 0xFF,
            ins: 0xB0,
            p1: 0x00,
            p2: block,
            le: len
        });
    });
}

function readTag(reader) {
    var startBlock = 4;
    var blockLength = 16;

    // [ACR1251U-A1 Application Programming Interface V1.07]
    // [AN1305 - MIFARE Classic as NFC Type MIFARE Classic Tag]

    // Get the tag and length - first bytes of the starting block (sector 1, block 0)
    return readBlock(reader, startBlock, blockLength).then(function (buf) {
        // chop off the status code
        buf = buf.slice(0, -2);
        var offset = 0;
        var tag;
        do {
            tag = buf[offset++];
        } while (!tag && offset < blockLength - 4);

        if (!tag) {
            throw new Error("Blank card?");
        } else if (tag !== 0x03) {
            throw new Error("Unknown tag type at the start: " + tag);
        }

        var dataLength = buf[offset++];
        if (dataLength === 0xff) {
            // Length is 2 bytes, 0xff to 0xffff
            dataLength |= (buf[offset++] << 8);
        }
        var dataStart = offset;

        // how much of the data has been read
        var totalLength = blockLength - offset;
        var blocks = [ buf ];

        // Get the rest of the data.
        var readNext = function (block) {
            if (totalLength >= dataLength) {
                var allData = Buffer.concat(blocks);
                return allData.slice(dataStart, dataStart + dataLength);

            } else {
                if ((block & 3) === 3) {
                    // ignore the trailer block
                    block += 2;
                } else {
                    block++;
                }
                return readBlock(reader, block, blockLength).then(function (buf) {
                    buf = buf.slice(0, -2);
                    totalLength += blockLength;
                    blocks.push(buf);
                    return readNext(block);
                });
            }

        };
        return readNext(startBlock);
    });
}

function authenticateBlock(reader, block) {
    // Load Authentication Keys
    return send(reader, {
        cla: 0xff,
        ins: 0x86,
        p1: 0x00,
        p2: 0x00,
        lc: 0x05,
        data: [
            0x01, // version: 1
            0x00, // always 0
            block, // block number
            0x61, // key type
            0x01  // key number
        ]
    });
}

nfc.on("reader", function (reader) {
    reader.autoProcessing = false;
    reader.on("card", function (card) {

        // [NFCForum-TS-NDEF_1.0: NFC Data Exchange Format (NDEF) Technical Specification]
        readTag(reader, 4).then(function (tag) {
            var text = ndef.getTagText(tag);
            console.log("tag text: '" + text + "'");
        }, console.error);
    });
    reader.on("error", function (err) {
        console.error(err);
    });
});

nfc.on("error", function (err) {
    console.error(err);
});

