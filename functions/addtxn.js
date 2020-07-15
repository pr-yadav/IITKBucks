function IntToBytes (num,bits){
    if(bits==4){
        var buf = Buffer.alloc(4);
        buf.writeInt32BE(num);
    }
    else{
        var buf =Buffer.alloc(8)
        num = BigInt(num)
        buf.writeBigInt64BE(num)
    }
    return buf
}

module.exports = function main(txn){
    const input = require('../classes/Input')
    const output = require('../classes/Output')
    const index = require('../index')
    const sha256 = require('sha256')
    var transaction = Buffer.alloc(0)
    var no_of_inputs = txn["inputs"].length
    raw_pending["data"].push(txn);
    var Inputs = [];
    var Outputs = [];
    transaction=Buffer.concat([transaction,IntToBytes( no_of_inputs,4)])
    var id ,idx,sign,sign_len,coins,public,public_len;
    for(var i=0;i<no_of_inputs;i++){
        id=txn["inputs"][i]["transactionId"];
        idx = txn["inputs"][i]["index"];
        sign_len = Buffer.byteLength(txn["inputs"][i]["signature"], 'hex');
        sign = txn["inputs"][i]["signature"];
        transaction=Buffer.concat([transaction,Buffer.from(txn["inputs"][i]["transactionID"],'hex'),IntToBytes(txn["inputs"][i]["index"],4),IntToBytes(Buffer.byteLength(txn["inputs"][i]["signature"], 'hex'),4),Buffer.from(txn["inputs"][i]["signature"],'hex')])
        Inputs[i] = new input(id,idx,sign_len,sign);
    }
    
    var no_of_outputs = txn["outputs"].length
    transaction=Buffer.concat([transaction,IntToBytes( no_of_outputs,4)])
    for(var i=0;i<no_of_outputs;i++){
        transaction=Buffer.concat([transaction,IntToBytes( txn["outputs"][i]["amount"],8),IntToBytes(Buffer.byteLength(txn["outputs"][i]["recipeint"], 'utf8'),4),Buffer.from(txn["outputs"][i]["recipeint"],'utf8')])
        coins = txn["outputs"][i]["amount"];
        public_len=Buffer.byteLength(txn["outputs"][i]["recipeint"]);
        public=txn["outputs"][i]["recipeint"];
        Outputs[i]=new output(coins,public_len,public)
    }
    pending[sha256(transaction)]=transaction;    
    return transaction
}