const express = require('express');
const bodyParser = require('body-parser')
var addAlias = express.Router();
const index = require('../index')

addAlias.use(bodyParser.json());
addAlias.use(bodyParser.urlencoded({ extended: false }));


addAlias.post('/addAlias',(req, res) => {
    var alias = req.body.alias;
    var key =req.body.publicKey;
        if(users.has(alias) === false){
            //console.log("Request by user : "+JSON.stringify({key : key,value:value}))
            urls.forEach(peer => {
                 axios.post (peer, { "alias" : alias,"publicKey" : key})
                     .then(response => {
                        console.log("Request sent to : "+peer);
                        console.log("Response status by peer : "+response.statusText);
                     })
                     .catch((err) => {
                         console.log("Error in sending request to : "+peer);
                         console.log(err);
                     })
            })
            users.set(alias,key);
            wallet.set(key,[])
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain');
            res.send('User added');
        }
        else {
            res.statusCode = 400
            res.setHeader('Content-Type', 'text/plain');
            res.send('User already registered');
        }
    //console.log(urls)
})

module.exports = addAlias