const express = require('express');
const bodyParser = require('body-parser')
var index = require('../index')
var getPeers = express.Router();
getPeers.use(bodyParser.json());
getPeers.use(bodyParser.urlencoded({ extended: false }));

getPeers.route('/getPeers').get((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(JSON.stringify({peers : urls}))
})
module.exports = getPeers;