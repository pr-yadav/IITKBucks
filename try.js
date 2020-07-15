const crypto = require('crypto')
const fs = require('fs')
var msg ="cc7f49ea1a79fea25e82eb187f674b75bfa80e99155d088866f8f32d7ef1212c00000001659509c0d11708c86f2528a2d5fa0202b79f29b6fa550b1a6d7f4893a60c976d";
console.log(msg.length)
var Key = fs.readFileSync('./a_private.pem', 'utf8');
function createSign(data,privateKey){
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(Buffer.from(data, 'hex'));
    signature = sign.sign({key:privateKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING,saltLength:32}).toString('hex');
    return signature
}
//console.log(createSign(msg,Key));
var key = fs.readFileSync('./a_public.pem', 'utf8');
var si ="6cf8cecb6dd3b2f7bad24474952317c18bcbdcc7862d9d95facfd86f44752d208cf7453296fe8083d93a1281330b9baa908e14fc411a703e995c4411f651e83d34428643f4dae8ad88bb52c377fc5d4a4b6556ae14f2d38e45f3abb5edc3f41039cb04673f121c25c497b2ddabf5ea347d5ba29c436bce2b3f17a34f71ab8080592e96bcf6c0fe11fdda610df0ddba9d348100825a39a2c5c210d303b0c3ebf7f465ea4f7251ec5ae1fb81c7c9b1189b102d91621b864844aed4545ae214f586993620f5951da871c6577261cdb9d842385ea4e1a58d7aafc0ac432806311cd1854b5b9858580b118d6013bf0a6d1d3bfbe30520e480fd287370523140495cbb"
function verifysign (sign,data,publicKey){
    const verify = crypto.createVerify('RSA-SHA256')
    verify.update(Buffer.from(data, 'hex'))
    verifyRes = verify.verify({key:publicKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, Buffer.from(si,'hex'))
    if(verifyRes)return true
    else return false
}
console.log(verifysign(si,msg,key))
//data should be provided as buffer