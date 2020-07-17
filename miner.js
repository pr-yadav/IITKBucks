const fs = require('fs')
const sha256 = require('sha256');
const { Worker, parentPort,MessageChannel } = require('worker_threads');
const now = require('nano-time');
//const cd=require('./index')
parentPort.on('message',msg =>{
var pending=msg[0];
var n = msg[1]
// async function myLoop() {         //  create a loop function
//     setTimeout(function() {   //  call a 3s setTimeout when the loop is called
//       //var i =getblocks();   //  your code here
//       //i++;                    //  increment the counter
//       if (Object.entries(pending).length) {           //  if the counter < 10, call the loop function
//         myLoop();             //  ..  again which will trigger another 
//       }                       //  ..  setTimeout()
//     }, 1000)
//   }
while(Object.entries(pending).length==0){

}
console.log("Mining started")
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

// myLoop.then
// {
//     setTimeout(() => {
        
//     },120000 );
var block = Buffer.alloc(0);
var tmp= Buffer.alloc(0);
var i=0;
for(var txnid in pending){
    tmp=Buffer.concat([tmp,IntToBytes(Buffer.byteLength(pending[txnid]),4),pending[txnid]]);
    if(Buffer.byteLength(tmp)>999996){
        break;
    }
    i++;
    block=tmp;
}
block = Buffer.concat([IntToBytes(i,4),block]);
var block_head =Buffer.alloc(0);
var parent_hash
if(n!=0){
    var tmp0=n-1
parent_hash = fs.readFileSync('./mined_blocks/'+tmp0+'.dat');
parent_hash=sha256(parent_hash.slice(0,116))
}
else{
    parent_hash="0000000000000000000000000000000000000000000000000000000000000000"
}
var target="0000004000000000000000000000000000000000000000000000000000000000"
block_head=Buffer.concat([block_head,IntToBytes(n,4),Buffer.from(parent_hash,"hex"),Buffer.from(sha256(block),"hex"),Buffer.from(target,"hex")]);

var result1=Buffer.alloc(0)
i=0;
//console.log(result)
while(1){
    time=now();
    result1 = sha256(new Buffer.concat([block_head,IntToBytes(time,8),IntToBytes(i,8)]));
    //var hex= parseInt("0x"+result1);
    if(result1<target){
        console.log("Hash : "+result1);
        mined();
        break;
    }
    i++;
}

function mined(){
    block=Buffer.concat([block_head,IntToBytes(time,8),IntToBytes(i,8),block]);
    console.log(block);
    parentPort.postMessage(block);
    //more features to be added later
//}
}
})