/* AES加密start */
import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('MIICdgIBADANBgkq');

const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export default {
  encrypt(word) {
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  decrypt(word) {
    const decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
  base64encode(str) {
    let out;
    let i;
    const len = str.length;
    let c1;
    let c2;
    let c3;
    i = 0;
    out = '';
    while (i < len) {
      // eslint-disable-next-line no-bitwise
      c1 = str.charCodeAt(i++) & 0xff;
      if (i === len) {
        // eslint-disable-next-line no-bitwise
        out += base64EncodeChars.charAt(c1 >> 2);
        // eslint-disable-next-line no-bitwise
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += '==';
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i === len) {
        // eslint-disable-next-line no-bitwise
        out += base64EncodeChars.charAt(c1 >> 2);
        // eslint-disable-next-line no-bitwise
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        // eslint-disable-next-line no-bitwise
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += '=';
        break;
      }
      c3 = str.charCodeAt(i++);
      // eslint-disable-next-line no-bitwise
      out += base64EncodeChars.charAt(c1 >> 2);
      // eslint-disable-next-line no-bitwise
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      // eslint-disable-next-line no-bitwise
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      // eslint-disable-next-line no-bitwise
      out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
  },
};
