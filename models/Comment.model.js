const { Schema, model } = require("mongoose")

const commentSchema = new Schema({
   creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
   },
   bike: {
      type: Schema.Types.ObjectId,
      ref: "Bike"
   },
   text: String
},
{
   timestamps: true
})

const Comment = model('Comment', commentSchema)

module.exports = Comment