//Modules
const crypto = require('crypto');
const fs = require ('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');

//Functions
const byte_to_array = require('./functions/byte_to_array')
const verify_sign = require('./functions/verify_sign')
const output_hash = require('./functions/addbloc')
const verify = require('./functions/verify')


//Routes
const getBlock = require('./routes/getBlock')
const getPendingTransactions = require('./routes/getPendingTransactions')
const newPeer = require('./routes/newPeer')
const getPeers = require('./routes/getPeers')
const newBlock = require('./routes/newBlock')
const newTransaction = require('./routes/newTransaction')


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


main => {
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
            console.log(err);
        })
        if(urls.length >3)break;
    }
    if(urls.length == 0){
       console,log("No peers found")
       return;
    }
    server.listen(port , hostname,function(){
        console.log('Server running at http://'+hostname+':'+port);
    });
}
//transaction = byte_to_array(txn)

