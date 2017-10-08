# listener-poc

Proof of concept for the GPII in-process listeners.

## PC/SC external card reader
[pcsc.js](pcsc.js): Reads a simple NFC tag from a MiFARE 1k RFID card.

```
node pcsc.js [debug]
```

* Tested with ACR122U reader (almost works with Gemalto Prox-DU).
* Uses [nfc-pcsc](https://www.npmjs.com/package/nfc-pcsc), but the lower-level [@pokusew/pcsclite](https://www.npmjs.com/package/@pokusew/pcsclite) might be enough.

Free features:

* Cross platform.
* Card readers can be removed/added.
