const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Type can't be empty"],
      minlength: 3,
      maxlength: 50,
    },
    imageUrl: {
      type: String,
      required: [true, "Image can't be empty"],
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    isChecked: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
