const express = require('express');
const bodyParser = require('body-parser')
var newPeer = express.Router();
const index = require('../index')

newPeer.use(bodyParser.json());
newPeer.use(bodyParser.urlencoded({ extended: false }));


newPeer.post('/newPeer',(req, res) => {
    let url = req.body.url
    if(urls.length<4){
        urls.push(url)
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain');
        res.send("Welcome to IITKBucks")
    }
    else{
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify({peers : urls}))
    }
    //console.log(urls)
})

module.exports = newPeer