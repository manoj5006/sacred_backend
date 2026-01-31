const CryptoJS = require("crypto-js");

let secretKey = process.env.ENKEY

function encrypt(text) {
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
    return ciphertext;
}

function decrypt(text) {
    const bytes = CryptoJS.AES.decrypt(text, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

module.exports = { encrypt, decrypt };