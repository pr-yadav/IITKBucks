const express = require('express');
const bodyParser = require('body-parser')
var index = require('../index')
var getUnuseOutputs = express.Router();
getUnuseOutputs.use(bodyParser.json());
getUnuseOutputs.use(bodyParser.urlencoded({ extended: false }));

getUnuseOutputs.route('/getUnusedOutputs')
.post((req,res)=>{
    var alias = req.body.alias;
    var key =req.body.publicKey
    if(key==null){
        key = users.get(alias)
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    var obj = new Object()
    obj["unusedOutputs"] = wallet.get(key);
    res.send(JSON.stringify(obj));
})
module.exports = getUnuseOutputs;