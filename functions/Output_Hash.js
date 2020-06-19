function Outpt_Hash(transaction){
    const sha256 = require('sha256')
    var outpt_hash = Buffer.alloc(0);
    var no_of_inputs = transaction.readUInt32BE(0,4)
    var tmp=4;
    for(var i=0;i<no_of_inputs;i++){
        sign_length = transaction.readUInt32BE(tmp+36,tmp+40)
        tmp=tmp+40+sign_length
    }
    tmp1=tmp
    var no_of_outputs = transaction.readUInt32BE(tmp,tmp+4)
    tmp=tmp+4;
    for(var i=0;i<no_of_outputs;i++){
        var key_len = transaction.readUInt32BE(tmp+8,tmp+12)
        tmp=tmp+12+key_len
    }
    return(sha256(transaction.slice(tmp1,tmp)))
}
module.exports = Outpt_Hash