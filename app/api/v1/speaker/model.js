const mongoose = require("mongoose");

const SpeakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name can't be empty"],
      minlength: 3,
      maxlength: 50,
    },
    avatar: {
      type: String,
      default: "images/avatar.png",
    },
    role: {
      type: String,
      required: [true, "Role can't be empty"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User can't be empty"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Speaker", SpeakerSchema);
