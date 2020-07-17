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
//app.use('/',newBlock)
app.use('/',addAlias)
app.use('/',getPublicKey)
app.use('/',getUnusedOutputs)

server.listen(4565,function(){
    console.log('Server running at http://');
});