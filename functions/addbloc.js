function isEmpty(obj){
    for(var key in obj){
        if(obj,hasOwnProperty(key)){
            return false;
        }
    }
    return true;9
}
 module.exports = async function main(transaction){
    var index = require('../index')
    const sha256 = require('sha256')
    var txn_id=sha256(transaction)
    var id,idx,sign_length,signature,coins,key_len,key;
    var no_of_inputs = transaction.readUInt32BE(0,4)
    console.log("   Number of Inputs : " + no_of_inputs)
    var tmp=4;
    unused[txn_id] = {};   //addition of outputs to unused outputs
    wallet.set(key,[])
    console.log("   Inputs : ")
    for(var i=0;i<no_of_inputs;i++){
        id = transaction.toString("hex", 0+tmp, tmp +32)
        idx = transaction.readUInt32BE(tmp+32,tmp+36)
        sign_length = transaction.readUInt32BE(tmp+36,tmp+40)
        signature = transaction.toString("hex", 40+tmp, tmp +40 + sign_length)
        tmp=tmp+40+sign_length
        console.log("      transactionId : "+id)
        console.log("      index : "+idx)
        console.log("      Length of signature : "+sign_length)
        console.log("      signature : "+signature)
        wallet.set(unused[id][idx]["PublicKey"],[])
        delete unused[id][idx]   //removal from list of unused outputs
    }
    
    var no_of_outputs = transaction.readUInt32BE(tmp,tmp+4)
    tmp=tmp+4;
    console.log("   Number of Outputs : " + no_of_outputs)
    //console.log(no_of_outputs)
    console.log("   Outputs : ")
    for(var i=0;i<no_of_outputs;i++){
        coins = parseInt(transaction.toString("hex",tmp,tmp+8),16) + ""
        key_len = transaction.readUInt32BE(tmp+8,tmp+12)
        key = transaction.toString("utf8", tmp+12, tmp +12 + key_len)
        unused[txn_id][i] = {};    //addition of outputs to unused outputs
        unused[txn_id][i]["PublicKey"] = key;
        unused[txn_id][i]["coins"] = coins+"";
        try{
        wallet[key].push({transactionId:txn_id,
             index:i+1,
             amount:coins})
        }
        catch(err){
            wallet.set(key,{transactionId:txn_id,
                index:i+1,
                amount:coins})
        }
        tmp=tmp+12+key_len
        console.log("      Amount : "+coins)
        console.log("      Length of Public key : "+key_len)
        console.log("      Public Key : "+key)
    }
    
    delete pending[txn_id]     //removal from pending transactions
    //if(isEmpty(unused[txn_id])) delete unused[txn_id]
}
