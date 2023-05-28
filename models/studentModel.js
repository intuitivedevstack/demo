import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentName: {
    type: String,
  },

  parentName: {
    type: String,
  },
  parentNumber: {
    type: String,
  },
  studentNumber: {
    type: String,
  },
  cls: {
    type: String,
  },
  rollNumber: {
    type: String,
  },
  address: {
    type: String,
  },
});

const student = mongoose.model("student", studentSchema, "students");

export default student;
