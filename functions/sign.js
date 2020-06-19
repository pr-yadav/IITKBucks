const crypto = require('crypto')
function createSign(data,privateKey){
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    signature = sign.sign({key:privateKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING})
    return signature
}
module.exports = createSign

//data should be provided as buffer