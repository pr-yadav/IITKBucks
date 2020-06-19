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

//Routes
const getBlock = require('./routes/getBlock')
const getPendingTransactions = require('./routes/getPendingTransactions')
const newPeer = require('./routes/newPeer')
const getPeers = require('./routes/getPeers')
const newBlock = require('./routes/newBlock')
const newTransaction = require('./routes/newTransaction');
const { response } = require('express');


//Imp. variables and constants
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


pending = {}
// pending = {
//     "Transaction_ID" : {
//         txn
//     }
// }
n=0 //The index of block
urls = [] //The urls of peers
potential_peers = []


app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/',newTransaction)
app.use('/' ,getPeers);
app.use('/', getBlock);
app.use('/',getPendingTransactions)
app.use('/',newPeer)
app.use('/',newBlock)


function main() {
    var peer = prompt("Enter the first peer : ")
    potential_peers.push(peer)
    for(var i=0;i<potential_peers.length;i++){
        var block = JSON.stringify({url: potential_peers[i]})
        axios.post (potential_peers[i],block)
        .then(response => {
           console.log("Request sent to : "+peer);
           console.log("Response status by peer : "+response.statusCode);
           if(response.statusCode==200){
               urls.push(response.body.url)
           }
           else{
               potential_peers.push(response.body.peers)
           }
        })
        .catch((err) => {
            console.log("Error in sending request to : "+peer);
            //console.log(err);
        })
        if(urls.length >3)break;
    }
    
    if(urls.length == 0){
       console.log("No peers found")
       return;
    }
    //var i=0;
    while(1){
        axios.get (potential_peers[0]+'/'+i)
        .then(response => {
            while(1){
            var block = response.body
            if(response.statusCode==404)break;
            var no_of_txn = block.readUInt32BE(0,4)
            var len_of_txn;
            var tmp=4;
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
    }
    axios.get(potential_peers[i]+'/getPendingTransactions')
    .then(response =>{
        pending[addtxn(response.body)] = response.body

    })
    server.listen(port , hostname,function(){
        console.log('Server running at http://'+hostname+':'+port);
    });
}
main()
//transaction = byte_to_array(txn)

