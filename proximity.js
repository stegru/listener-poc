"use strict";

var edge = require("edge"),
    path = require("path");

var ndef = require("./ndef.js");

var proximity = edge.func({
    source: path.join(__dirname, "proximity.cs"),
    references: [
        "C:\\Windows\\System32\\WinMetadata\\Windows.Networking.winmd",
        "C:\\Windows\\System32\\WinMetadata\\Windows.Storage.winmd",
        "System.Runtime.dll",
        "System.Runtime.InteropServices.WindowsRuntime.dll"
    ]
});

// d1 01 0b 54 02 65 6e 63 61 74 61 6c 69 6e 61
// d1 01 0b 54 02 65 6e 63 61 74 61 6c 69 6e 61
var options = {
    gotTag: function (tag) {
        var text = process.nextTick(ndef.getTagText, tag);
        console.log(text);
    }
};

proximity(options,  function (err, ret) {
    console.log(ret);
});

setTimeout(console.log, 100000, "end");
