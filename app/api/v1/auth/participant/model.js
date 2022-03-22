const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ParticipantSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, "First name can't be empty!"],
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, "Last name can't be empty!"],
    },
    email: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, "Email can't be empty!"],
      unique: true,
    },
    role: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, "Role can't be empty!"],
    },
    password: {
      type: String,
      required: [true, "Password can't be empty!"],
    },
  },
  { timestamps: true }
);

ParticipantSchema.path("email").validate(
  function (value) {
    const EMAIL_REGEX = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_REGEX.test(value);
  },
  (attr) => `${attr.value} must be a valid email!`
);

ParticipantSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Participant").countDocuments({
        email: value,
      });
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} already registered`
);

ParticipantSchema.pre("save", function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

ParticipantSchema.methods.comparePassword = function (password) {
  const isMatch = bcrypt.compareSync(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("Participant", ParticipantSchema);
