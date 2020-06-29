const { verify } = require("crypto");

module.exports = (block) => {
    const fs = require('fs');
    const sha256 = require('sha256');
    const verify = require('./verify');
    const byte_to_array = require('./byte_to_array')
    var head = block.slice(0,116);
    var NoOfTransaction = block.readUInt32BE(116,120);
    var LenOfTransaction,tmp;
    var txn;
    tmp=120;
    for(var i =0;i<NoOfTransaction;i++){
        LenOfTransaction = block.readUInt32BE(tmp,tmp+4);
        txn = byte_to_array(block.splice(tmp+4,tmp+4+LenOfTransaction));
        tmp = tmp +4 + LenOfTransaction;
        if(verify(txn) == false) return false;
    }
    var idx_of_block = head.readUInt32BE(0,4);
    if(idx_of_block==0){
        if(head.toString("hex",4,36)!="00000000000000000000000000000000")return false;
    }
    else{
        var parent=fs.readFileSync('../mined_blocks/'+idx_of_block-1+'.dat');
        if(sha256(parent.toString("hex",0,116))!=head.toString("hex",4,36))return false;
    }

    if(sha256(block.slice(116,))!=head.toString("hex",36,68))return false;

    if(sha256(head)>head.toString("hex",68,100))return false;

    return true;
}