const {Schema, model} = require("mongoose")

const bikeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    weight: Number,
    size: {
        type: String,
        enum: ["infantil", "adolescente", "adulto"]
    },
    colour: String,
    description: String,
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
        required: true,
        default: ""
    },
    isSold: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true,
  }
)


const Bike = model("Bike", bikeSchema)

module.exports = Bike
