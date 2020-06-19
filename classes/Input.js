module.exports = class input{
    constructor(id,idx,length_of_sign,sign){
        this.Transaction_ID = id;
        this.Index = idx;
        this.Length_of_the_signature = length_of_sign;
        this.Signature = sign;
    }
}