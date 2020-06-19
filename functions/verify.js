///This is just a basic model for hoe unused outputs may look
// unused = {
//     "Transaction_ID" : {
//         "Index" : {
//             Publickey : "**************",
//             coins : "88888888"
//         }
//     }
// }

module.exports = function verify(txn) {
    const byte_to_array = require('./functions/byte_to_array')
    const verify_sign = require('./functions/verify_sign')
    const output_hash = require('./functions/output_hash')
    var no_inputs = transaction.no_inputs;
    var inputs = transaction.inputs;
    var no_outputs = transaction.no_outputs;
    var outputs = transaction.outputs;
    for (var i = 0; i < no_inputs; i++) {
        var tmp = inputs[i].Transaction_ID
        if (tmp in unused){
            if(inputs[i].Index in unused[tmp]) continue;
            else return false;
        }
        else {
            return false;          
        }
    }
  
    var req_coins = 0;
    var act_coins = 0;
    for (var i = 0; i < no_inputs; i++) {
        var tmp = inputs[i].Transaction_ID
        var tmp2 = unused[tmp]
        act_coins += tmp2.Index.coins;
    }
    for (var i = 0; i < no_outputs; i++) {
        req_coins += outputs[i].coins;
    }
    if (act_coins >= req_coins){}
    else {
        return false;
    }


   
    for (var i = 0; i < no_inputs; i++) {
        var msg = Buffer.alloc(4)
        msg.writeInt32BE(inputs[i].Index)
        msg = Buffer.concat([Buffer.from(inputs[i].Transaction_ID,'hex'),msg,Buffer.from(output_hash(txn),'hex')])
        var public = unused.inputs[i].Transaction_ID.Index.public_key;
        var sign = inputs[i].Signature
        if(verify_sign(sign,msg,public)){
            continue;
        }
        else {
            return false;
        }
    }
    return true;
}

