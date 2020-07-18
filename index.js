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
const verify_bloc = require('./functions/verify_bloc')
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
const { worker } = require('cluster');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
potential_peers =  [
    "https://74525f0cb7d0.ngrok.io",
    "http://0874d9468a7d.ngrok.io",
    "https://iitkbucks.pclub.in",
    "http://dd1e805d83b7.ngrok.io",
    "https://1ac9c6a5055a.ngrok.io",
        "http://0874d9468a7d.ngrok.io",
        "http://0874d9468a7d.ngrok.io",
        "https://74525f0cb7d0.ngrok.io",
        "http://dd1e805d83b7.ngrok.io",
        "https://74525f0cb7d0.ngrok.io",
        "http://d9d186ee9e23.ngrok.io",
        "http://0874d9468a7d.ngrok.io",
        "http://542e3ce6efe3.ngrok.io",
        "https://cc3f5a355a74.ngrok.io"

    ]




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


async function getpeers(url)
{
    await axios.post(url + '/newPeer', {
    url : "http://a025ca779601.ngrok.io"
    })
    .then( response => {
        if(response.status === 200)
        {
            urls.push(url);
            console.log("Request sent to "+url+" to make peer");
            console.log("Response status by peer : "+response.status);
        }
    })
    .catch( async (err) => {
        //console.log(err)
        await axios.get (url + '/getPeers')
        .then(response => {
            var peers = response.data.peers;
            console.log(peers);
            if(urls.length <= 3)
                for(var peer of peers)
                {
                    if(urls.indexOf(peer) === -1)
                        potential_peers.push(peer);
                }
        }).catch(err => {
            console.log("Error getting peers from : "+url + '/getPeers');
        });
    });
}
async function getblocksn(){
    await axios.get (urls[0]+'/getBlock/'+n,{responseType: 'arraybuffer'})
    .then(response => {
        console.log(urls[0]+'/getBlock/'+n)
        var b = response.data
        var block = Buffer.from(b)
        if(response.status==404){
            console.log("All Blocks found");
            throw new Error("All Blocks Found");
        }
            if(verify_bloc(response.data)){
            fs.writeFileSync('./mined_blocks/'+n+'.dat',response.data);
            var tmp=116;
            var no_of_txn = parseInt(block.toString("hex",tmp,tmp+4),16) //block heaader is of 116 bytes
            var idx = block.readUInt32BE(0,4)
            //n=idx
            var len_of_txn;
            tmp=120;
            var txn;
            var i=1
            console.log("Numer of transactions in this block : "+no_of_txn)
            var call = setInterval(() => {
                len_of_txn=block.readUInt32BE(tmp,tmp+4)
                txn = addbloc(block.slice(tmp+4,tmp+4+len_of_txn))
                tmp=tmp+4+len_of_txn
                i++;
                if(i>no_of_txn){
                    clearInterval(call)
                }
            }, 0);
            
            console.log("Index of Block added : "+n);
            n++;
            }
            else {console.log("KH")}
        
        
    })
    .catch(err =>{
            //console.log(err)
        if(response.status=404){
            //console.log(n)
            throw new Error("All Blocks Found");
        }
        else{
            console.log(err);
        }
        throw new Error("All Blocks Found");
    })
    
}
async function obtaintxns(){
    await axios.get(urls[0]+'/getPendingTransactions')
    .then(response =>{
        console.log("Obtaining Pending Transactions")
        var tmp = response.data
        console.log("Pending Transactions : ")
        //raw_pending["data"].push(response.data)
        tmp.forEach(txns=>{
            console.log(txns)
            addtxn(txns)
        })
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
async function getblocks()
{
    if(urls.length !== 0)
    {
        console.log("Total peers: " + urls.length);
        console.log(urls);
        while(1)
        {
            try{
                await getblocksn();
            }
            catch(err)
            {   //console.log(err)
                console.log("All Blocks Found");
                break;
            }
        }
    }
    else{
        console.log("No Peers!")
        process.exit(1)
    }
}
async function main(){
    console.log("Welcome to IITKBucks")
    await potential_peers.forEach(async (url) => {
        if (urls.length <= 3)
            await getpeers(url);
    });

    setTimeout(async () => {
       await getblocks()
    }, 2000);
    
    setTimeout(() => {
        obtaintxns();
    }, 20000);
    setTimeout(() => {
        start_miner();
        console.log("Miner Started")
    }, 25000);
    
    
    
}
main()

function start_miner(){

    miner.postMessage([pending,n]);
    miner.on('message',msg =>{
        miner.terminate()
        var tmp =n;
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
        urls.forEach(async url => {
            await axios.post(url,msg)
            .then(res => {
                console.log("Request sent to "+url);
                console.log("Response status by peer : "+res.status);
            })
            .catch(err =>{
                console.log("Error sending request to : "+url)
            })
        });
        miner = new Worker('./miner.js',resourceLimits=1024)
        miner.postMessage([pending,n]);
        start_miner();
    })
}
