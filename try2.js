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
function getblocks(){
    
    //return true;
    //while(1){
        n=0;
        axios.get ("http://localhost:3456/")
        .then(response => {
            var block=response.data
            //block = response.data
            if(response.status==404){
                console.log("hell")
                console.log("All Blocks found");
                return n;
            }
            console.log(block)
            fs.writeFile('./hell',response.data,function (err) {
                if (err) throw err;
                console.log('Saved!');
              });
              block=fs.readFileSync('./hell')
              console.log(block)
              var tmp=0
             var no_of_txn = block.readUInt32BE(tmp,tmp+4)//block heaader is of 116 bytes
             tmp=4;
             console.log(no_of_txn)
             id =block.toString("hex", 0+tmp, tmp +32)
             console.log(id)
             tmp=36
             hash =block.toString("hex", 0+tmp, tmp +32)
             console.log(hash)
             tmp=68
             target =block.toString("hex", 0+tmp, tmp +32)
             console.log(target)
             tmp=100
             nonce = parseInt(block.toString("hex",tmp,tmp+8),16)
             console.log(nonce)
            n++;
        })
        .catch(err =>{
            console.log(err);
            return n;
        })
    //}
    return n;
}
getblocks()