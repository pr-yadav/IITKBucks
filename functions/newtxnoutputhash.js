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
    
    var no_of_outputs = txn["outputs"].length
    transaction=Buffer.concat([transaction,IntToBytes( no_of_outputs,4)])
    for(var i=0;i<no_of_outputs;i++){
        transaction=Buffer.concat([transaction,IntToBytes( txn["outputs"][i]["amount"],8),IntToBytes(Buffer.byteLength(txn["outputs"][i]["recipeint"], 'utf8'),4),Buffer.from(txn["outputs"][i]["recipeint"],'utf8')])
    }
    return sha256(transaction)
}