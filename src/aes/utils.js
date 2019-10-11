import CryptoJS from 'crypto-js/crypto-js'

// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse("abcdef0123456789");
const IV = CryptoJS.enc.Utf8.parse('0123456789abcdef');
const SIGN_KEY="abc";
/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(word, keyStr, ivStr) {
    if(word){
        let key = KEY
        let iv = IV
        if (keyStr) {
            key = CryptoJS.enc.Utf8.parse(keyStr);
            iv = CryptoJS.enc.Utf8.parse(ivStr);
        }

        let srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        // console.log("-=-=-=-", encrypted.ciphertext)
        return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    }else{
        return '';
    }

}

/**
 * AES 解密 ：字符串 key iv  返回base64
 *
 */
export function Decrypt(word, keyStr, ivStr) {
    if(word){
        let key  = KEY
        let iv = IV

        if (keyStr) {
            key = CryptoJS.enc.Utf8.parse(keyStr);
            iv = CryptoJS.enc.Utf8.parse(ivStr);
        }

        let base64 = CryptoJS.enc.Base64.parse(word);
        let src = CryptoJS.enc.Base64.stringify(base64);

        var decrypt = CryptoJS.AES.decrypt(src, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });

        var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    }else{
        return '';
    }
}
export function preSign(jsonArr) {
    let precodeStr = jsonArr.sort((a, b) => a.key < b.key? -1: 1).reduce((all, u) => all + (u.value==undefined?"":u.value), '') + SIGN_KEY;
    return precodeStr;
}

export function EncryptReplace(word, keyStr, ivStr) { //加密调用这个
    return Encrypt(word, keyStr, ivStr).replace(/\+/g,'$input')
}

export function ParamsAppend(params) { //封装加密参数
    let result = {};
    params.map(n=>{
        result[n.key]=EncryptReplace(n.value==undefined?"":n.value.toString());
    });
    return JSON.parse(JSON.stringify(result));
}
