const express = require('express');
const bodyParser = require('body-parser')
const fs =require('fs')
var getBlock = express.Router();
getBlock.use(bodyParser.json());
getBlock.use(bodyParser.urlencoded({ extended: false }));
const index = require('../index')
getBlock.route('/').all((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Welcome to IITKBucks")
})


getBlock.route('/getBlock/:n').get((req,res) => {
    
    if(req.params.n<= n){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/octet-stream');
        fs.createReadStream("./mined_blocks/"+req.params.n + ".dat").pipe(res)
    }
    else{
        res.statusCode =404;
        res.setHeader('Content-Type', 'text/plain');
        res.send("Chain is not that long")
    }
})

module.exports = getBlock;
