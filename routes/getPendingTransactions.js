const express = require('express');
const bodyParser = require('body-parser')
const fs =require('fs')
var index = require('../index')
var getPendingTransactions = express.Router();
getPendingTransactions.use(bodyParser.json());
getPendingTransactions.use(bodyParser.urlencoded({ extended: false }));

getPendingTransactions.route('/getPendingTransactions').get((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(raw_pending["data"]))
})

module.exports = getPendingTransactions;
