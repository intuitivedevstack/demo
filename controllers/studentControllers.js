import student from "../models/studentModel.js";
import fee from "../models/feeModel.js";

const insertstudent = async (req, res) => {
  const {
    studentName,
    parentName,
    parentNumber,
    studentNumber,
    cls,
    rollNumber,
    address,
  } = req.body;

  const studentItem = new student({
    studentName,
    parentName,
    parentNumber,
    studentNumber,
    cls,
    rollNumber,
    address,
  });

  studentItem
    .save()
    .then((data) => {
      console.log(data);
      res.status(201).json({
        status: "success",
        message: "successfully added",
      });
    })
    .catch((err) => {
      console.log(err, "Error");
    });
};

const getstudents = async (req, res) => {
  try {
    const data = await student.find();

    res.json({
      status: "success",
      length: data.length,
      data,
    });
  } catch (err) {
    res.json({
      status: "error",
      message: err.message,
    });
  }
};

const getstudentsByUserId = async (req, res) => {
  let { limit, page } = req.query;
  limit = Number(limit);
  page = Number(page);

  try {
    const data = await student.find();

    const resultantData = data.slice((page - 1) * limit, page * limit);

    function compare(a, b) {
      if (a.studentName < b.studentName) {
        return -1;
      }
      if (a.studentName > b.studentName) {
        return 1;
      }
      return 0;
    }

    resultantData.sort(compare);

    res.json({
      status: "success",
      length: resultantData.length,
      total: data.length,
      resultantData,
      data: data,
    });
  } catch (err) {
    res.json({
      status: "error",
      message: err.message,
    });
  }
};

// Find by id

const getstudentById = async (req, res) => {
  const { studentId } = req.query;
  try {
    const data = await student.findOne({ _id: studentId });

    const findData = data;

    res.json({
      status: "success",
      findData,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: err.message,
    });
  }
};

const postfee = async (req, res) => {
  const { studentId } = req.query;

  req.body.studentid = studentId;

  await fee.create(req.body);

  try {
    res.json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: err.message,
    });
  }
};

const getfee = async (req, res) => {
  let { studentId } = req.query;

  const data = await fee.find({ studentid: studentId });

  try {
    res.json({
      status: "success",
      length: data.length,
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: err.message,
    });
  }
};

const deletestudentById = async (req, res) => {
  const { studentId } = req.query;
  try {
    await student.deleteOne({ _id: studentId });

    res.json({
      status: "success",
      message: "successfully deleted !",
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: err.message,
    });
  }
};

const deletefeeById = async (req, res) => {
  const { feeid } = req.query;
  try {
    await fee.deleteOne({ _id: feeid });

    res.json({
      status: "success",
      message: "successfully deleted !",
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: err.message,
    });
  }
};

export {
  insertstudent,
  getstudents,
  getstudentById,
  getstudentsByUserId,
  postfee,
  deletestudentById,
  deletefeeById,
  getfee,
};
