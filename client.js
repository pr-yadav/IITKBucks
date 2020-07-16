const crypto = require('crypto');
const prompt = require('prompt-sync')()
const axios = require('axios')
const fs = require('fs');
const sha256=require('sha256');
function IntToBytes (num,bits){
    if(bits==4){
        var buf = Buffer.alloc(4);
        buf.writeInt32BE(num);
    }
    else{
        var buf =Buffer.alloc(8)
        num = BigInt(num)
        buf.writeBigInt64BE(num)
    }
    return buf
}
function createSign(data,privateKey){
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(Buffer.from(data, 'hex'));
    signature = sign.sign({key:privateKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING,saltLength:32}).toString('hex');
    return signature
}
const url ="http://localhost:3000";
function start(){
    console.log("Welcome to IITKBucks\nChoose any of the following : \n1. Add alias\n2. Generate Keys\n3. Check Balance\n4. Transfer Funds\n");
    var option = prompt("Choose an option : ")
    if(option == 1){
        var alias = prompt("Enter the alias : ")
        var Key_file = prompt("Enter the file name containing Public Key : ")
        var key = fs.readFileSync('./'+Key_file, 'utf8')
        axios.post (url+"/addAlias", { "alias" : alias,"publicKey" : key})
        .then(response => {
            console.log("Request sent");
            console.log("Response status : "+response.statusText);
        })
        .catch((err) => {
            console.log(err)
            console.log("Error in sending request");
        })
    }
    else if(option == 2){
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem'
            }
        });
        fs.writeFileSync('./public.pem',publicKey);
        fs.writeFileSync('./private.pem',privateKey);
        console.log("Keys saved in files public.pem and private.pem");
    }
    else if(option == 3){
        console.log("What do you want to send:\n1. Alias\n2. Public Key")
        var choice = prompt();
        if(choice == 1){
            var alias = prompt("Enter the ailas : ");
            axios.post (url+"/getUnusedOutputs", { "alias" : alias})
            .then(response => {
                var balance =0;
                var outputs =response.unusedOutputs;
                for(output in outputs){
                    balance = balance+output["amount"];
                }
                console.log(balance)
            })
            .catch((err) => {
                console.log("Error in sending request");
            })
        }
        else{
            var key_file = prompt("Enter the file containing Public Key : ");
            var key = fs.readFileSync('./'+key_file,'utf-8')
            axios.post (url+"/getUnusedOutputs", {"publicKey" : key})
            .then(response => {
                var balance =0;
                var outputs =response.unusedOutputs;
                for(output in outputs){
                    balance = balance+output["amount"];
                }
                console.log(balance)
            })
            .catch((err) => {
                console.log("Error in sending request");
            })
        }
    }
    else if(option == 4){
        var txn = {"inputs" : [],"outputs" : []};
        var buf =Buffer.alloc(0);
        //var output_hash = Buffer.alloc(0);
        var balance =0,amt_given=0;
        var private_key_file = prompt("Enter the file containing private key : ");
        var privateKey=fs.readFileSync('./'+private_key_file,'utf-8');
        var public_key_file = prompt("Enter the file containing Public Key : ");
        var publicKey = fs.readFileSync('./'+public_key_file,'utf-8');
        axios.post (url+"/getUnusedOutputs", {"publicKey" : publicKey})
        .then(response => {
            var outputs =response["unusedOutputs"];
            for(var output in outputs){
                txn["inputs"].push({
                    "transactionId": output["transactionId"],
                    "index": output["index"],
                    "signature": ""
                })
                balance = balance+output["amount"];
            }
            console.log("Your Current Balance : "+balance)
        })
        .catch((err) => {
            console.log("Error in sending request");
        })
        setTimeout(() => {
            
        
        var no_of_outputs = prompt("Enter no. of outputs : ")
        var output_hash=IntToBytes(no_of_outputs+1,4)
        var i=0
        for( i=0;i<no_of_outputs;i++){
            setTimeout(() => {
            console.log("What would you use alias or public key for output\n1. alias")
            var aliasorkey = prompt("2. Public Key")
            var user_key;
            if(aliasorkey==1){
                var user_alias = prompt("Enter the alias : ");
                axios.post (url+"/getPublicKey", {"alias" : user_alias})
                .then(response => {
                    user_key = response.publicKey;
                    console.log(user_key)
                })
                .catch((err) => {
                    console.log("User not present");
                })
            }
            else{
                user_key = prompt("Enter the key : ")
            }
            setTimeout(() => {
            var amt = prompt("Enter the amount for this recipeint : ")
            
            var amt_given;
            amt_given=amt_given+amt;
            txn["outputs"].push({
                "amount": amt,
                "recipient": user_key
            })
            output_hash=Buffer.concat([output_hash,IntToBytes(amt,8),IntToBytes(Buffer.byteLength(user_key),4),Buffer.from(user_key,'utf-8')])
            }, 500*(i+1));
            }, 1000*i);
        }
        setTimeout(() => {
        var txn_fees = prompt("Please enter the fees : ")
        txn["outputs"].push({
            "amount": balance-amt_given-txn_fees,
            "recipient": publicKey
        })
        output_hash=Buffer.concat([output_hash,IntToBytes(balance-amt_given-txn_fees,8),IntToBytes(Buffer.byteLength(publicKey),4),Buffer.from(publicKey,'utf-8')])
        output_hash=Buffer.from(sha256(output_hash),'hex')
        for(var input in txn["inputs"]){
            buf = Buffer.concat([Buffer.from(input["transactionId"],'hex'),IntToBytes(input["index"],4),output_hash]);
            input["signature"] = createSign(buf,privateKey)
        }
        axios.post (url+"/newTransaction", txn)
        .then(response => {
            console.log(response.statusText)
        })
        .catch((err) => {
            console.log("Error in sending request");
        })
        }, 1050*(i));
        }, 1000);
    }
    else{
        console.log("Please choose a valid option.")
    }
    //start()
}
start()