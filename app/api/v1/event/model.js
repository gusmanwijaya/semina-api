const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, "Title can't be empty!"],
    },
    cover: {
      type: String,
      required: [true, "Cover can't be empty!"],
    },
    date: {
      type: Date,
      required: [true, "Date can't be empty!"],
    },
    city: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, "City can't be empty!"],
    },
    price: {
      type: Number,
    },
    tagline: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, "Tagline can't be empty!"],
    },
    about: {
      type: String,
      required: [true, "About can't be empty!"],
    },
    keypoint: {
      type: Array,
      required: [true, "Keypoint can't be empty!"],
    },
    vanueName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, "Vanue Name can't be empty!"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    speaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
