const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    deleteUser: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    image: {
      type: String,
      default: ""
    },
    favBikes: [{
      type: Schema.Types.ObjectId,
      ref: "Bike"
    }],
    boughtBikes: [{
      type: Schema.Types.ObjectId,
      ref: "Bike"
    }],
    soldBikes: [{
      type: Schema.Types.ObjectId,
      ref: "Bike"
    }]
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema)

module.exports = User;
