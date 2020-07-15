const express = require('express');
const bodyParser = require('body-parser')
var newTransaction = express.Router();
const index = require('../index');
const verify = require('../functions/verify')
newTransaction.use(bodyParser.json());
newTransaction.use(bodyParser.urlencoded({ extended: false }));
const addtxn =require('../functions/addtxn')


newTransaction.post('/newTransaction',(req, res) => {
    if(verify(req.body)){
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