const crypto = require('crypto')
function verifysign (sign,data,publicKey){
    const verify = crypto.createVerify('RSA-SHA256')
    verify.update(data)
    verifyRes = verify.verify({key:publicKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, sign)
    if(verifyRes)return true
    else return false
}

module.exports=verifysign;

//data and sign should be provided as buffer