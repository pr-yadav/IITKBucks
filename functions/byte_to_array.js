module.exports = function txn_byte_to_array(transaction){
    var input = require('../classes/Input.js')
    const output = require('../classes/Output.js') 
    const Transaction = require('../classes/transaction')
    var Inputs = new Array;
    var Outputs = new Array;
    var no_of_inputs = transaction.readUInt32BE(0,4)
    tmp=4;
    var obj = { "inputs":[],"outputs":[]}
    for(var i=0;i<no_of_inputs;i++){
        id = transaction.toString("hex", 0+tmp, tmp +32)
        idx = transaction.readUInt32BE(tmp+32,tmp+36)
        sign_length = transaction.readUInt32BE(tmp+36,tmp+40)
        signature = transaction.toString("hex", 40+tmp, tmp +40 + sign_length)
        tmp=tmp+40+sign_length
        obj["inputs"].push({
            "transactionId" : id ,
            "index" : idx ,
            "signature" : signature 
        })
    }
    
    var no_of_outputs = transaction.readUInt32BE(tmp,tmp+4)
    tmp=tmp+4;
    for(var i=0;i<no_of_outputs;i++){
        var coins = parseInt(transaction.toString("hex",tmp,tmp+8),16)
        var key_len = transaction.readUInt32BE(tmp+8,tmp+12)
        var key = transaction.toString("utf8", tmp+12, tmp +12 + key_len)
        tmp=tmp+12+key_len
        obj["outputs"].push({
            "amount" : coins ,
            "recipient" : key ,
        })
    }
    return  obj
}
