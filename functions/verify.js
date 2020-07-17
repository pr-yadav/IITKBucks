///This is just a basic model for ho unused outputs may look
// unused = {
//     "Transaction_ID" : {
//         "Index" : {
//             Publickey : "**************",
//             coins : "88888888"
//         }
//     }
// }
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

module.exports = async function verify(transaction) {
    const index = require('../index')
    const verify_sign = require('./verify_sign')
    const output_hash = require('./Output_Hash')
    const newtxnoutputhash=require('./newtxnoutputhash')
    for (var input in transaction["inputs"]) {
        if(n==0)break;
        var tmp = input["transactionId"]
        if (tmp in unused){
            if(input["index"] in unused[tmp]) continue;
            else{
                return false
            }
        }
        else {
            return false;          
        }
    }
    
    var req_coins = 0;
    var act_coins = 0;
    for (var input in transaction["inputs"]) {
        if(n==0)break;
        var tmp6=input["transactionId"]
        var tmp7=input["index"]
        var tmp2 = unused[tmp6][tmp7]["coins"]
        act_coins += tmp2;
    }
    for (var output in transaction["outputs"]) {
        req_coins += output["amount"];
    }
    if(n==0){}
    else if (act_coins >= req_coins){}
    else {
        return false;
    }

   
    for (var input in transaction["inputs"]) {
        var msg = Buffer.alloc(0)
        msg = Buffer.concat([Buffer.from(input.transaction_Id,'hex'),IntToBytes(input.index,4),Buffer.from(newtxnoutputhash(txn),'hex')])
        var public = unused.inputs[i].Transaction_ID.Index.public_key;
        var sign = Buffer.from(input["signature"],'hex')
        if(verify_sign(sign,msg,public)){
        }
        else {
            return false;
        }
    }
    return true;
}

