import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },

  students: {
    type: Array,
    required: true,
  },
});

const student = mongoose.model("student", studentSchema, "students");

export default student;
