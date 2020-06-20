const express = require('express');
const bodyParser = require('body-parser')
var newTransaction = express.Router();
const index = require('../index');
newTransaction.use(bodyParser.json());
newTransaction.use(bodyParser.urlencoded({ extended: false }));
const addtxn =require('../functions/addtxn')


newTransaction.post('/newTransaction',(req, res) => {
    addtxn(req.body);
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain');
    res.send("Thanks")
})

module.exports = newTransaction