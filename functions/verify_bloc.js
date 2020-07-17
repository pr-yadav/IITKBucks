
module.exports = (block) => {
    const fs = require('fs');
    const sha256 = require('sha256');
    const verify = require('./verify');
    const byte_to_array = require('./byte_to_array')
    var head = block.slice(0,116);
    var NoOfTransaction = parseInt(block.toString("hex",116,120),16)
    var LenOfTransaction,tmp;
    var txn;
    tmp=120;
    for(var i =0;i<NoOfTransaction;i++){
        LenOfTransaction = block.readUInt32BE(tmp,tmp+4);
        txn = byte_to_array(block.slice(tmp+4,tmp+4+LenOfTransaction));
        tmp = tmp +4 + LenOfTransaction;
        if(verify(txn)==false) return false;
    }
    var idx_of_block = head.readUInt32BE(0,4)
    if(idx_of_block==0){
        if(head.toString("hex",4,36)!="0000000000000000000000000000000000000000000000000000000000000000")return false;
        console.log("Parent hash : 0000000000000000000000000000000000000000000000000000000000000000")
    }
    else{
        var tmp1=idx_of_block-1;
        var parent=fs.readFileSync('./mined_blocks/'+tmp1+'.dat');
        if(sha256(parent.slice(0,116))!=head.toString("hex",4,36))return false;
        console.log("Parent Hash : "+head.toString("hex",4,36))
    }

    if(sha256(block.slice(116,))!=head.toString("hex",36,68))return false;
    console.log("Hash of Block body : "+head.toString("hex",36,68))
    if(sha256(head)>head.toString("hex",68,100))return false;
    console.log("Target : "+head.toString("hex",68,100))
    console.log("Hash of te block : " +sha256(head))
    console.log("Block verified with index : "+idx_of_block)
    return true;
}