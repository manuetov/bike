const {Schema, model} = require("mongoose")

const transactionSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bike: {
        type: Schema.Types.ObjectId,
        ref: "Bike",
        required: true
    }
})


const Transaction = model("Transaction", transactionSchema)


module.exports = Transaction