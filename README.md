# listener-poc

Proof of concept for the GPII in-process listeners.

## PC/SC external card reader
[pcsc.js](pcsc.js): Reads a simple NFC tag from a MiFARE 1k RFID card.

```
node pcsc.js [debug]
```

* Tested with ACR122U reader (almost works with Gemalto Prox-DU).
* Uses [nfc-pcsc](https://www.npmjs.com/package/nfc-pcsc), but the lower-level [@pokusew/pcsclite](https://www.npmjs.com/package/@pokusew/pcsclite) might be enough.
* Tested with electron (gpii-app).

Free features:

* Cross platform.
* Card readers can be removed/added.

## Proximity device (VAIO internal card reader)
[proximity.js](proximity.js): Reads a simple NFC tag from the proximity device.

```
node proximity.js
```

* Uses a slither of C#.
* Tested with electron (gpii-app).
* Re-uses the same NDEF parsing code as the PC/SC listener.

## USB Drive

* In [stegru/windows#GPII-2294-experimental](https://github.com/stegru/windows/blob/GPII-2294-experimental/gpii/node_modules/listeners/src/usb.js)
* USB detection is windows-only.
* Tested with electron (gpii-app).
