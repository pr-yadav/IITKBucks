const express = require('express');
const bodyParser = require('body-parser')
var newTransaction = express.Router();
const index = require('../index');
const verify = require('../functions/verify')
const axios = require('axios')
newTransaction.use(bodyParser.json());
newTransaction.use(bodyParser.urlencoded({ extended: false }));
const addtxn =require('../functions/addtxn');
const { async } = require('q');


newTransaction.post('/newTransaction',async (req, res) => {
    //await (req.data)
    //console.log(req.data)
    //console.log(req.body)
    if(verify(req.body)){
        console.log("New Transaction recieved")
    //     urls.forEach(peer => {
    //         axios.post (peer, req.body)
    //             .then(response => {
    //                console.log("Transaction sent to : "+peer);
    //                console.log("Response status by peer : "+response.statusText);
    //             })
    //             .catch((err) => {
    //                 console.log("Error in sending request to : "+peer);
    //                 console.log(err);
    //             })
    //    })
       //console.log(req.data)
        addtxn(req.body);
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain');
        res.send("Thanks")
        
    }
    else{
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain');
        res.send("Invalid Transaction")
    }
})

module.exports = newTransaction