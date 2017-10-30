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

```
node proximity.js
```

* Uses a slither of C#.
* Tested with electron (gpii-app).
* Re-uses the same NDEF parsing code as the PC/SC listener.
