const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name can't be empty"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email can't be empty"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password can't be empty"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["super-admin", "admin"],
      default: "super-admin",
    },
  },
  { timestamps: true }
);

UserSchema.path("email").validate(
  function (value) {
    const EMAIL_REGEX = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_REGEX.test(value);
  },
  (attr) => `${attr.value} must be a valid email!`
);

UserSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").countDocuments({
        email: value,
      });
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} already registered`
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
