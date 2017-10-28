
"use strict";

function expect(actual, expected, message) {
    console.assert(expected === actual, message, expected, actual);
}

// [NFCForum-TS-NDEF_1.0: NFC Data Exchange Format (NDEF) Technical Specification]
module.exports = {
    getTagText: function (tag) {
        console.log("tag bytes", tag);
        // not fully reading the header - assumes the rest of the buffer is the payload.
        var headerLength = 4;
        expect(tag[0], 0xD1, "Record header (single record, short record length, well-known type name)");
        expect(tag[1], 1, "type length (1)");
        expect(tag[2], tag.length - headerLength, "payload length (rest of buffer)");
        expect(tag[3], 0x54, "type field ('T': text)");

        var payload = tag.slice(headerLength);
        expect(payload[0], 0x02, "status byte (utf-8, 2 byte language)");
        expect(payload.toString("ascii", 1, 3), "en", "language code (en)");

        var text = payload.toString("ascii", 3, tag.length - headerLength);
        return text;
    }
};
