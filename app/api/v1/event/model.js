const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title can't be empty"],
      minlength: 3,
      maxlength: 50,
    },
    price: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      required: [true, "Date can't be empty"],
    },
    cover: {
      type: String,
      required: [true, "Cover can't be empty"],
    },
    about: {
      type: String,
      required: [true, "About can't be empty"],
    },
    venueName: {
      type: String,
      required: [true, "Vanue name can't be empty"],
    },
    tagline: {
      type: String,
      required: [true, "Tagline can't be empty"],
    },
    keyPoint: [
      {
        type: String,
      },
    ],
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category can't be empty"],
    },
    speaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
      required: [true, "Speaker can't be empty"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User can't be empty"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
