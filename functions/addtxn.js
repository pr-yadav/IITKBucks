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
    const sha256 = require('sha256')
    var transaction = Buffer.alloc(0)
    var no_of_inputs = txn["inputs"].length
    transaction=Buffer.concat([transaction,IntToBytes( no_of_inputs,4)])
    for(var i=0;i<no_of_inputs;i++){
        transaction=Buffer.concat([transaction,Buffer.from(txn["inputs"][i]["transactionID"],'hex'),IntToBytes(txn["inputs"][i]["index"],4),IntToBytes(Buffer.byteLength(txn["inputs"][i]["signature"], 'hex'),4),Buffer.from(txn["inputs"][i]["signature"],'hex')])
        Inputs[i] = new input(id,idx,Buffer.byteLength(signature, 'hex'),signature);
    }
    
    var no_of_outputs = txn["outputs"].length
    transaction=Buffer.concat([transaction,IntToBytes( no_of_outputs,4)])

    for(var i=0;i<no_of_outputs;i++){
        transaction=Buffer.concat([transaction,IntToBytes( txn["outputs"][i]["amount"],8),IntToBytes(Buffer.byteLength(txn["outputs"][i]["recipeint"], 'utf8'),4),Buffer.from(txn["outputs"][i]["recipeint"],'utf8')])
        
    }
    
    
    return sha256(transaction)
}