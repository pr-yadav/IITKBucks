const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')
const axios = require('axios');
const index = require('../index')
const addbloc = require('../functions/Output_Hash')
var newBlock = express.Router();
const verify_block=require('../functions/verify_bloc')
newBlock.use(bodyParser.urlencoded({ extended: false }));

const { Worker, parentPort,MessageChannel,isMainThread } = require('worker_threads');

newBlock.post('/newBlock', function (req, res) {
    var bl = JSON.parse(JSON.stringify(req.body))
    console.log(bl)

    var block
    for(key in bl )
        block = Buffer.from(key)
    
    console.log(block)
    
    
    if(verify_block(block)){
        miner.terminate().then(console.log("Worker Stopped"));;    //stops miner
        urls.forEach(url => {
            axios.post (url,block)
                .then(response => {
                   console.log("Block sent to : "+peer);
                   console.log("Response status by peer : "+response.status);
                })
                .catch((err) => {
                    console.log("Error in sending request to : "+peer);
                    console.log(err);
                })
       })
       var no_of_txn = block.readUInt32BE(116,120)
       var len_of_txn;
       var tmp=120;
       for(var i=0;i<no_of_txn;i++){
            len_of_txn=block.readUInt32BE(tmp,tmp+4)
            addbloc(block.slice(tmp+4,tmp+4+len_of_txn))
            tmp=tmp+4+len_of_txn
       }
        fs.writeFile('../mined_blocks'+n+'.dat',block);
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain');
        res.end("Block added");
        n++;
        
    }
    else{
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain');
        res.end("Invalid Block");
    }
    miner = new Worker('./miner.js',resourceLimits=1024)
    miner.postMessage([pending,n]);
})

module.exports = newBlock