import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  studentid: {
    type: String,
  },
  msg: {
    type: String,
    default: null,
  },
  photo: {
    data: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
  },
  pdf: {
    data: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
  },
});

const file = mongoose.model("file", fileSchema, "files");

export default file;
