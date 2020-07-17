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
    console.log("   Inputs : ")
    txn["inputs"].forEach(tx => {
        
    
        id=tx["transactionId"];
        idx = tx["index"];
        sign_len = Buffer.byteLength(tx["signature"], 'hex');
        sign = tx["signature"];
        transaction=Buffer.concat([transaction,Buffer.from(tx["transactionId"],'hex'),IntToBytes(tx["index"],4),IntToBytes(Buffer.byteLength(tx["signature"], 'hex'),4),Buffer.from(tx["signature"],'hex')])
        console.log("      transactionId : "+id)
        console.log("      index : "+idx)
        console.log("      Length of signature : "+sign_len)
        console.log("      signature : "+sign)
        Inputs[i] = new input(id,idx,sign_len,sign);
    
    });
    console.log("   Outputs : ")
    var no_of_outputs = txn["outputs"].length
    transaction=Buffer.concat([transaction,IntToBytes( no_of_outputs,4)])
    for(var i=0;i<no_of_outputs;i++){
        transaction=Buffer.concat([transaction,IntToBytes( txn["outputs"][i]["amount"],8),IntToBytes(Buffer.byteLength(txn["outputs"][i]["recipient"], 'utf8'),4),Buffer.from(txn["outputs"][i]["recipient"],'utf8')])
        coins = txn["outputs"][i]["amount"];
        public_len=Buffer.byteLength(txn["outputs"][i]["recipient"]);
        public=txn["outputs"][i]["recipient"];
        Outputs[i]=new output(coins,public_len,public)
        console.log("      Amount : "+coins)
        console.log("      Length of Public key : "+public_len)
        console.log("      Public Key : "+public)
    }
    pending[sha256(transaction)]=transaction;    
    return transaction
}