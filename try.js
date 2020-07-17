
const crypto = require('crypto');
const fs = require ('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');
const prompt = require('prompt-sync')()
const axios = require('axios')
const { Worker, parentPort,MessageChannel,isMainThread } = require('worker_threads');
const Promise= require('promise');axios.post("http://96496fa83f4b.ngrok.io/newBlock",fs.readFileSync('./mined_blocks/0.dat'))
            .then(res => {
                console.log(fs.readFileSync('./mined_blocks/0.dat'))
                console.log("Request sent to ");
                console.log("Response status by peer : "+res.status);
            })
            .catch(err =>{
                console.log(fs.readFileSync('./mined_blocks/0.dat'))
                console.log("Error sending request to : error")
            })