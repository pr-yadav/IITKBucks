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



const server=http.createServer(app);
server.listen(3456);


app.get('/',(req,res)=>{
    res.statusCode = 200;
        res.setHeader('Content-Type', 'application/octet-stream');
        fs.createReadStream("./0").pipe(res)
})