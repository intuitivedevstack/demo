import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name required"],
  },

  InstituteName: {
    type: String,
    required: [true, "Institute name required"],
  },

  contactNumber: {
    type: String,
    required: [true, "Contact number required"],
  },

  email: {
    type: String,
    required: [true, "Email required"],
    lowercase: true,
    validate: [validator.isEmail, "Email format incorrect"],
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minLength: 8,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "Confirm password needed"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password don't match",
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },

  passwordResetToken: String,
  passwordResetExpiry: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 2000;
  this.passwordConfirmation = undefined;
  next();
});

// instance method
userSchema.methods.verifyPassword = async function (
  userPassword,
  encryptedPassword
) {
  return await bcrypt.compare(userPassword, encryptedPassword);
};

userSchema.methods.invalidateTokens = function (tokeniat) {
  if (this.passwordChangedAt) {
    const tokenTimeStamp = new Date(tokeniat * 1000);
    return this.passwordChangedAt > tokenTimeStamp;
  }

  return false;
};

userSchema.methods.createResetToken = function () {};

const User = mongoose.model("User", userSchema);

export default User;
