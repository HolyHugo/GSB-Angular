"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var POW_2_24 = Math.pow(2, 24);
var POW_2_32 = Math.pow(2, 32);
var Sha1Service = /** @class */ (function () {
    function Sha1Service() {
    }
    Sha1Service.prototype.hex = function (n) {
        var s = "", v;
        for (var i = 7; i >= 0; --i) {
            v = (n >>> (i << 2)) & 0xF;
            s += v.toString(16);
        }
        return s;
    };
    Sha1Service.prototype.lrot = function (n, bits) {
        return ((n << bits) | (n >>> (32 - bits)));
    };
    Sha1Service.prototype.string2ArrayBuffer = function (s) {
        s = s.replace(/[\u0080-\u07ff]/g, function (c) {
            var code = c.charCodeAt(0);
            return String.fromCharCode(0xC0 | code >> 6, 0x80 | code & 0x3F);
        });
        s = s.replace(/[\u0080-\uffff]/g, function (c) {
            var code = c.charCodeAt(0);
            return String.fromCharCode(0xE0 | code >> 12, 0x80 | code >> 6 & 0x3F, 0x80 | code & 0x3F);
        });
        var n = s.length, array = new Uint8Array(n);
        for (var i = 0; i < n; ++i) {
            array[i] = s.charCodeAt(i);
        }
        return array.buffer;
    };
    Sha1Service.prototype.hash = function (bufferOrString) {
        var source;
        if (bufferOrString instanceof ArrayBuffer) {
            source = bufferOrString;
        }
        else {
            source = this.string2ArrayBuffer(String(bufferOrString));
        }
        var h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0, i, sbytes = source.byteLength, sbits = sbytes << 3, minbits = sbits + 65, bits = Math.ceil(minbits / 512) << 9, bytes = bits >>> 3, slen = bytes >>> 2, s = new Uint32ArrayBigEndian(slen), s8 = s.bytes, j, w = new Uint32Array(80), sourceArray = new Uint8Array(source);
        for (i = 0; i < sbytes; ++i) {
            s8[i] = sourceArray[i];
        }
        s8[sbytes] = 0x80;
        s.set(slen - 2, Math.floor(sbits / POW_2_32));
        s.set(slen - 1, sbits & 0xFFFFFFFF);
        for (i = 0; i < slen; i += 16) {
            for (j = 0; j < 16; ++j) {
                w[j] = s.get(i + j);
            }
            for (; j < 80; ++j) {
                w[j] = this.lrot(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var a = h0, b = h1, c = h2, d = h3, e = h4, f, k, temp;
            for (j = 0; j < 80; ++j) {
                if (j < 20) {
                    f = (b & c) | ((~b) & d);
                    k = 0x5A827999;
                }
                else if (j < 40) {
                    f = b ^ c ^ d;
                    k = 0x6ED9EBA1;
                }
                else if (j < 60) {
                    f = (b & c) ^ (b & d) ^ (c & d);
                    k = 0x8F1BBCDC;
                }
                else {
                    f = b ^ c ^ d;
                    k = 0xCA62C1D6;
                }
                temp = (this.lrot(a, 5) + f + e + k + w[j]) & 0xFFFFFFFF;
                e = d;
                d = c;
                c = this.lrot(b, 30);
                b = a;
                a = temp;
            }
            h0 = (h0 + a) & 0xFFFFFFFF;
            h1 = (h1 + b) & 0xFFFFFFFF;
            h2 = (h2 + c) & 0xFFFFFFFF;
            h3 = (h3 + d) & 0xFFFFFFFF;
            h4 = (h4 + e) & 0xFFFFFFFF;
        }
        return this.hex(h0) + this.hex(h1) + this.hex(h2) + this.hex(h3) + this.hex(h4);
    };
    Sha1Service = __decorate([
        core_1.Injectable()
    ], Sha1Service);
    return Sha1Service;
}());
exports.Sha1Service = Sha1Service;
var Uint32ArrayBigEndian = /** @class */ (function () {
    function Uint32ArrayBigEndian(length) {
        this.bytes = new Uint8Array(length << 2);
    }
    Uint32ArrayBigEndian.prototype.get = function (index) {
        index <<= 2;
        return (this.bytes[index] * POW_2_24)
            + ((this.bytes[index + 1] << 16)
                | (this.bytes[index + 2] << 8)
                | this.bytes[index + 3]);
    };
    Uint32ArrayBigEndian.prototype.set = function (index, value) {
        var high = Math.floor(value / POW_2_24), rest = value - (high * POW_2_24);
        index <<= 2;
        this.bytes[index] = high;
        this.bytes[index + 1] = rest >> 16;
        this.bytes[index + 2] = (rest >> 8) & 0xFF;
        this.bytes[index + 3] = rest & 0xFF;
    };
    return Uint32ArrayBigEndian;
}());
//# sourceMappingURL=app.service.crypto.js.map