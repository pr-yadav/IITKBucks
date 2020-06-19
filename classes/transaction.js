module.exports = class Transaction{
    constructor(no_inputs,inputs,no_outputs,outputs){
        this.no_inputs = no_inputs;
        this.inputs = inputs;
        this.no_outputs = no_outputs;
        this.outputs = outputs;
    }
}