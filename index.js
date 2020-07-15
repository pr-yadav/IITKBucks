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
const { Worker, parentPort,MessageChannel,isMainThread } = require('worker_threads');
const Promise= require('promise');
//Functions
const byte_to_array = require('./functions/byte_to_array')
const verify_sign = require('./functions/verify_sign')
const output_hash = require('./functions/addbloc')
const verify = require('./functions/verify')
const addbloc = require('./functions/addbloc')
const addtxn = require('./functions/addtxn')

//Routes
const getBlock = require('./routes/getBlock')
const getPendingTransactions = require('./routes/getPendingTransactions')
const newPeer = require('./routes/newPeer')
const getPeers = require('./routes/getPeers')
const newBlock = require('./routes/newBlock')
const newTransaction = require('./routes/newTransaction');
const addAlias = require('./routes/addAlias')
const getPublicKey = require('./routes/getPublicKey')
const getUnusedOutputs = require('./routes/getUnusedOutputs');
const { async } = require('q');


//Imp. variables and constants
miner = new Worker('./miner.js',resourceLimits=1024)
const hostname = 'localhost';
const port = 3000
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

raw_pending = {"data" : []}    //in same format as user input
pending = {}
// pending = {
//     "Transaction_ID" : {
//         txn(binary datapending)
//     }
// }
n=0 //The index of block
urls = [] //The urls of peers
potential_peers = []
target=0x00000f0000000000000000000000000000000000000000000000000000000000
users = new Map()
wallet = new Map()
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/',newTransaction)
app.use('/' ,getPeers);
app.use('/', getBlock);
app.use('/',getPendingTransactions)
app.use('/',newPeer)
app.use('/',newBlock)
app.use('/',addAlias)
app.use('/',getPublicKey)
app.use('/',getUnusedOutputs)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function getpeers() {
    var peer = prompt("Enter the first peer : ")
    potential_peers.push(peer)
    //console.log("hello")
    //return true;
    var block = JSON.stringify({url: "http://987a5160bea7.ngrok.io"})
    for(var person of potential_peers){
        //console.log("hello")
            axios.post (person+"newPeer",block)
            .then(response => {
                //console.log("hello")
                console.log("Request sent to : "+person);
                console.log("Response status by peer : "+response.status);
                if(response.status==200){
                    console.log(users)
                    urls.push(users)
                }
                else{
                    axios.get(users+'/getPeers')
                    .then(response => {
                       potential_peers.push(response.body.peers);
                    })
                }
            })
            .catch((err) => {
                console.log("Error in sending request to : "+peer);
                //console.log(err);
            })
        
        
        if(urls.length >3){return urls.length;}
    }
    return
    
}
    //var i=0;
async function getblocks(){
    //console.log("hello")
    //return true;
    while(1){
        axios.get (urls[0]+'/getBlock/'+n)
        .then(response => {
            var block = response.body
            if(response.statusCode==404){
                console.log("All Blocks found");
                return;
            }
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
        })
    }
    return;
}
async function obtaintxns(){
    //console.log("hello")
    axios.get(potential_peers[0]+'/getPendingTransactions')
    .then(response =>{
        raw_pending["data"].push(response.body)
        for(var txns in response){
            addtxn(txns)
        }

    })
    .catch((err) => {
        console.log(err)
    })
    server.listen(port , hostname,function(){
        console.log('Server running at http://'+hostname+':'+port);
    });
}
async function main(){
    var lenofusers=await getpeers();
    if(lenofusers==0){
        console.log("no peers found");
        return;
    }
    else{
        var obtainblocks = await getblocks();
        obtaintxns();
    }
}
//start_miner();
main()
function start_miner(){

    miner.postMessage(pending);
    miner.on('message',msg =>{
        var tmp =n+1;
        fs.writeFile('./mined_blocks/'+(tmp)+'.dat',msg)
        n++;
        var no_of_txn = msg.readUInt32BE(116,120)
        var len_of_txn;
        var tmp=120;
        for(var i=0;i<no_of_txn;i++){
            len_of_txn=msg.readUInt32BE(tmp,tmp+4)
            addbloc(msg.slice(tmp+4,tmp+4+len_of_txn))
            tmp=tmp+4+len_of_txn
        }
        for(url in urls){
            axios.post(url,msg)
            .then(function (response) {
                console.log(response);
            })
        }
        
        start_miner();
    })
}
