const express = require('express');
const bodyParser = require('body-parser')
const fs =require('fs')
var getBlock = express.Router();
getBlock.use(bodyParser.json());
getBlock.use(bodyParser.urlencoded({ extended: false }));

getBlock.route('/').all((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Welcome to IITKBucks")
})


getBlock.route('/getBlock/:n').get((req,res) => {
    res.statusCode = 200;
    try{
        var data = fs.readFileSync("./mined_blocks/" + req.params.n + ".dat")
        res.setHeader('Content-Type', 'application/octet-stream');
        fs.createReadStream("./mined_blocks/"+req.params.n + ".dat").pipe(res)
    }
    catch(err){
        res.setHeader('Content-Type', 'text/plain');
        res.send("Chain is not that long")
    }
})

module.exports = getBlock;
