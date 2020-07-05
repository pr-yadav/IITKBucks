//Modules
const crypto = require('crypto');
const fs = require ('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');
const prompt = require('prompt-sync')()
const axios = require('axios')
const { Worker, parentPort } = require('worker_threads');


//Functions
const byte_to_array = require('./functions/byte_to_array')
const verify_sign = require('./functions/verify_sign')
const output_hash = require('./functions/addbloc')
const verify = require('./functions/verify')
const addbloc = require('./functions/addbloc')


//Routes
const getBlock = require('./routes/getBlock')
const getPendingTransactions = require('./routes/getPendingTransactions')
const newPeer = require('./routes/newPeer')
const getPeers = require('./routes/getPeers')
const newBlock = require('./routes/newBlock')
const newTransaction = require('./routes/newTransaction');
const addtxn = require('./functions/addtxn');


//Imp. variables and constants
miner = new Worker('./miner.js')
const hostname = 'localhost';
const port = 3001
const server=http.createServer(app);
unused = {}
// unused = {
//     "Transaction_ID" : {
//         "Index" : {
//             Publickey : "**************",
//             coins : "88888888"
//         },
//          "Index" : {
//             Publickey : "**************",
//             coins : "88888888"
//         }
//     }
// }

raw_pending = { "data" : []}    //in same format as user input
pending = {}
// pending = {
//     "Transaction_ID" : {
//         txn(binary datpending)
//     }
// }
n=0 //The index of block
urls = [] //The urls of peers
potential_peers = []
target=0x00FF 

app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/',newTransaction)
app.use('/' ,getPeers);
app.use('/', getBlock);
app.use('/',getPendingTransactions)
app.use('/',newPeer)
app.use('/',newBlock)


miner.onMessage('message',msg =>{
    var tmp =n+1;
    fs.writeFile('./mined_blocks/'+(tmp)+'.dat')
    n++;
    addbloc(msg);
})
function main() {
    var peer = prompt("Enter the first peer : ")
    //console.log("hello")
    potential_peers.push(peer)
    var block = JSON.stringify({url: "my url"})
    //console.log(potential_peers.length)
    for(var i=0;i<potential_peers.length;i++){
        console.log("hello")
        const post = async _ => {
        //setTimeout(() => {
            console.log("hello")
            axios.post (potential_peers[i]+"/newPeer",block)
            .then(response => {
                console.log("Request sent to : "+peer);
                console.log("Response status by peer : "+response.statusCode);
                if(response.statusCode==200){
                    urls.push(potential_peers[i])
                }
                else{
                    axios.get(potential_peers[i]+'/getPeers')
                    .then(response => {
                       potential_peers.push(response.body.peers);
                    })
                }
                return response.statusCode;
            })
            .catch((err) => {
                console.log("Error in sending request to : "+peer);
                //console.log(err);
            })
        }
        post().then(value =>{
            console.log(value)
        })
            //}, 0)
        if(urls.length >3)break;
    }
    
    // if(urls.length == 0){
    //    console.log("No peers found")
    //    return;
    // }
    //var i=0;
    while(1){
        setTimeout(() => {
            
        
        axios.get (potential_peers[0]+'/getBlock'+n)
        .then(response => {
            while(1){
            var block = response.body
            if(response.statusCode==404)break;
            var no_of_txn = block.readUInt32BE(116,120) //block heaader is of 116 bytes
            var len_of_txn;
            var tmp=120;
            var txn;
            for(var i=0;i<no_of_txn;i++){
                len_of_txn=block.readUInt32BE(tmp,tmp+4)
                txn = addbloc(block.slice(tmp+4,tmp+4+len_of_txn))
                tmp=tmp+4+len_of_txn
            }
            fs.writeFile('../mined_blocks'+n+'.dat',block);
            n++;
        }
        })
    }, 1000);
    }
    axios.get(potential_peers[0]+'/getPendingTransactions')
    .then(response =>{
        raw_pending["data"].push(response.body)
        raw_pending["data"].forEach(element => {
            addtxn(element);
        });


    })
    server.listen(port , hostname,function(){
        console.log('Server running at http://'+hostname+':'+port);
    });
}

main();
start_miner();
function start_miner(){
    miner.postMessage("start");
}
//transaction = byte_to_array(txn)

