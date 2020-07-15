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
var si ="33261abdd8bf564a9e41d21b309cdbf1d7cdb83dbce31deb7ff2a2a76bdf54d3dbe74a2e3b6c3a44d2f0aa769d56a1adf5ce3b859969aa41047e4fe40ff8e545d7249013922d442953eaf489d9d2add17dd616feeacf7955f57a9c5c2e447fe9bd0bb9976696cdb97fdd1ea05fc770fd50f0abbde8db1932bc7bb7690ec80b2aa924161d38c3f59d609d6fd01445a5eeb04540b5908e3d1e6c649ea0be44e778d216a0fc83e27a5ab3208b17d7594cee1128904cc9e64675a15e71a64ce1e0162d6a3e3007ce00e83fe6ebca9fe8c2de4ce2a9002d48a85a53a769573ce6c0e85bbdd128b6795687bf2feb5bff13f060c903f56b51500b7e7b800510bf27ecd0"
function verifysign (sign,data,publicKey){
    const verify = crypto.createVerify('RSA-SHA256')
    verify.update(Buffer.from(data, 'hex'))
    verifyRes = verify.verify({key:publicKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, Buffer.from(si,'hex'))
    if(verifyRes)return true
    else return false
}
console.log(verifysign(si,msg,key))
//data should be provided as buffer