
const fs = require ('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');
const axios = require('axios')

axios({
    method: 'post',
    url: 'http://a025ca779601.ngrok.io/newBlock',
    data: fs.readFileSync('./mined_blocks/0.dat'),
    headers: 'application/octet-stream'
    })
.then(res => {
                console.log(fs.readFileSync('./mined_blocks/0.dat'))
                console.log("Request sent to ");
                console.log("Response status by peer : "+res.status);
            })
            .catch(err =>{
                console.log(err)
                console.log(fs.readFileSync('./mined_blocks/0.dat'))
                console.log("Error sending request to : error")
            })