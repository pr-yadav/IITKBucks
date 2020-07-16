const express = require('express');
const bodyParser = require('body-parser')
var index = require('../index')
var getPublicKey = express.Router();
getPublicKey.use(bodyParser.json());
getPublicKey.use(bodyParser.urlencoded({ extended: false }));

getPublicKey.route('/getPublicKey')
.post((req,res)=>{
    var alias = req.body.alias;
    if(users.has(alias) === true){
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        var obj = new Object()
        obj["publicKey"] = users.get(alias);
        //console.log(users.get(alias));
        console.log(JSON.stringify(obj))
        res.send(JSON.stringify(obj));
    }
    else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain');
        res.send('User not found');
    }
})
module.exports = getPublicKey;