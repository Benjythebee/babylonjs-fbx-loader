"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const binary_reader_1 = require("@picode/binary-reader");
/**
 * Reads a 64 bits unsigned integer.
 */
binary_reader_1.BinaryReader.prototype.readUint64 = function () {
    const low = this.readUint32();
    const high = this.readUint32();
    return high * 0x100000000 + low;
};
/**
 * Reads a 64 bits signed integer.
 */
binary_reader_1.BinaryReader.prototype.readInt64 = function () {
    let low = this.readUint32();
    let high = this.readUint32();
    // calculate negative value
    if (high & 0x80000000) {
        high = ~high & 0xffffffff;
        low = ~low & 0xffffffff;
        if (low === 0xffffffff) {
            high = (high + 1) & 0xffffffff;
        }
        low = (low + 1) & 0xffffffff;
        return -(high * 0x100000000 + low);
    }
    return high * 0x100000000 + low;
};
/**
 * Reads a 8 bits signed integer array.
 */
binary_reader_1.BinaryReader.prototype.readUint8Array = function (size) {
    return Buffer.from(this.binary.buffer.slice(this.offset, (this.offset += size)));
};
//# sourceMappingURL=binary-reader.js.map