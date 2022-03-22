const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event can't be empty!"],
    },
    personalDetail: {
      firstName: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: [true, "First name can't be empty"],
      },
      lastName: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: [true, "Last name can't be empty"],
      },
      email: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: [true, "Email can't be empty"],
      },
      role: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: [true, "Role can't be empty"],
      },
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Payment can't be empty"],
    },
    historyEvent: {
      type: Object,
      required: [true, "History event can't be empty!"],
    },
    historyPayment: {
      type: Object,
      required: [true, "History payment can't be empty!"],
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: [true, "Participant can't be empty"],
    },
  },
  { timestamps: true }
);

TransactionSchema.path("personalDetail.email").validate(
  function (value) {
    const EMAIL_REGEX = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_REGEX.test(value);
  },
  (attr) => `${attr.value} must be a valid email!`
);

module.exports = mongoose.model("Transaction", TransactionSchema);
