const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^[0-9+ -]+$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  const comparePassword = this.password;
  const genSalt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(comparePassword, genSalt);
  this.password = hashPassword;
  next();
});
module.exports = mongoose.model("Userinfo", userSchema);
