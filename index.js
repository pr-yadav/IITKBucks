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
target="0000004000000000000000000000000000000000000000000000000000000000"
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

function getpeers() {
    var peer = prompt("Enter the first peer : ")
    potential_peers.push(peer)
    //console.log("hello")
    //return true;
    var block = JSON.stringify({url: "http://d9267c5a0d45.ngrok.io"})
    for(var i=0;i<potential_peers.length;i++){
        var person=potential_peers[i]
    
        //console.log("hello")
            axios.post (person+"/newPeer",block)
            .then(response => {
                //console.log("hello")
                console.log("Request sent to : "+person);
                console.log("Response status by peer : "+response.status);
                if(response.status==200){
                    //console.log(person)
                    urls.push(person)
                }
                else{
                    axios.get(users+'/getPeers')
                    .then(response => {
                       potential_peers.push(response.body.peers);
                    })
                }
            })
            .catch((err) => {
                console.log("Error in sending request to : "+person);
                axios.get(person+'/getPeers')
                .then(response => {
                    potential_peers.push(response.data.peers);
                    //console.log(response.data.peers)
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
        
            //console.log("hello")
        if(urls.length >3){return urls.length;}
        }
    return urls.length
    
}
function getblocks(){
    
    //return true;
    //while(1){
        var call = setInterval(() => {
            
        
        //console.log("hello")
        axios.get (urls[0]+'/getBlock/'+n)
        .then(response => {

            //var block=new Buffer
            var b = response.data
            var block = Buffer.from(b)
            //console.log(block)
            if(response.status==404){
                console.log("All Blocks found");
                return clearInterval(call);
            }
            fs.writeFileSync('./mined_blocks/'+n+'.dat',response.data);
            var tmp=116;
            var no_of_txn = parseInt(block.toString("hex",tmp,tmp+4),16) //block heaader is of 116 bytes
            var len_of_txn;
            tmp=120;
            var txn;
            for(var i=0;i<no_of_txn;i++){
                len_of_txn=block.readUInt32BE(tmp,tmp+4)
                txn = addbloc(block.slice(tmp+4,tmp+4+len_of_txn))
                tmp=tmp+4+len_of_txn
            }
            
            console.log("Block added : "+n);
            n++;
        })
        .catch(err =>{
            console.log("All Blocks Found");
            return clearInterval(call);
        })
    }, 2000);
    //}
    return;
    //}
    //return n;
}
function obtaintxns(){
    //console.log("hello")
    axios.get(potential_peers[0]+'/getPendingTransactions')
    .then(response =>{
        console.log("Obtaining Pending Transactions")
        raw_pending["data"].push(response.body)
        for(var txns in response.body){
            addtxn(txns)
        }
        //console.log(response.body)

    })
    .catch((err) => {
        console.log(err)
    })
    setTimeout(() => {
    server.listen(port , hostname,function(){
        console.log('Server running at http://'+hostname+':'+port);
    });
    }, 2000);
}
function main(){
    getpeers();
    setTimeout(() => {
       getblocks()
    }, 2000);
    
    setTimeout(() => {
        obtaintxns();
    }, 110000);
    setTimeout(() => {
        start_miner();
        console.log("Miner Started")
    }, 120000);
    
    
}
//start_miner();
main()
function start_miner(){

    miner.postMessage([pending,n]);
    miner.on('message',msg =>{
        var tmp =n+1;
        fs.writeFile('./mined_blocks/'+(tmp)+'.dat',msg,function (err) {
            if (err) throw err;
            console.log('Saved!');
          }); 
        n++;
        var tmp=116
        var no_of_txn = parseInt(msg.toString("hex",tmp,tmp+4),16)
        var len_of_txn;
        tmp=120;
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
