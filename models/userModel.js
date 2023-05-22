import mongoose from "mongoose";

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
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minLength: 8,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "Confirm password needed"],
  },
  createdDate: {
    type: String,
    default: new Date().toJSON().slice(0, 10).split("-").reverse().join("-"),
  },
});

const User = mongoose.model("User", userSchema);

export default User;
