import student from "../models/studentModel.js";
import { v4 as uuidv4 } from "uuid";

const insertstudent = async (req, res) => {
  const { userid, studentdetails } = req.body;

  studentdetails.fees = [];
  studentdetails.id = uuidv4();

  const existingUser = await student.findOne({ userid });

  console.log(existingUser);

  if (existingUser) {
    let allStudents = [...existingUser.students, studentdetails];
    await student.updateOne(
      { userid: existingUser.userid },
      { $set: { userid: existingUser.userid, students: allStudents } }
    );

    res.json({
      status: "success",
      message: "successfully added",
    });
  } else {
    let students = [];
    students.push(studentdetails);
    const studentItem = new student({
      userid,
      students,
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
  }
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
  let { userid, limit, page } = req.query;
  limit = Number(limit);
  page = Number(page);

  try {
    const data = await student.findOne({ userid });

    const resultantData = data.students.slice((page - 1) * limit, page * limit);

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
      total: data.students.length,
      resultantData,
      data: data.students,
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
  console.log(req.query, "fired");
  const { studentId, userid } = req.query;
  try {
    const data = await student.findOne({ userid });

    const findData = data.students.find((ele) => ele.id == studentId);

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
  console.log(req.query, "fired");
  const { studentId, userid } = req.query;
  try {
    const data = await student.findOne({ userid });

    const findData = data.students.find((ele) => ele.id == studentId);

    req.body.id = uuidv4();
    findData.fees = [req.body, ...findData.fees];

    await student.updateOne(
      { userid: userid },
      { $set: { userid: userid, students: [...data.students] } }
    );

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

const postmsg = async (req, res) => {
  const { userid } = req.query;
  try {
    const data = await student.findOne({ userid });

    if (req.body.classVal === "All") {
      data.students.map((ele) => {
        ele.msg = req.body.msg;
      });
    } else {
      data.students.map((ele) => {
        if (ele.class === req.body.classVal) {
          ele.msg = req.body.msg;
        }
      });
    }

    await student.updateOne(
      { userid: userid },
      { $set: { userid: userid, students: [...data.students] } }
    );

    res.json({
      status: "Successfully Sent Message !",
    });
  } catch (err) {
    res.json({
      status: "error",
      message: err.message,
    });
  }
};

const deletestudentById = async (req, res) => {
  console.log(req.query, "fired");
  const { studentId, userid } = req.query;
  try {
    const data = await student.findOne({ userid });

    let filtered = data.students.filter((ele) => ele.id != studentId);

    await student.updateOne(
      { userid: userid },
      { $set: { userid: userid, students: [...filtered] } }
    );

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
  console.log(req.query, "fired");
  const { feeid, studentId, userid } = req.query;
  try {
    const data = await student.findOne({ userid });

    let findData = data.students.find((ele) => ele.id == studentId);

    const filteredFees = findData.fees.filter((ele) => ele.id != feeid);

    findData.fees = filteredFees;

    await student.updateOne(
      { userid: userid },
      { $set: { userid: userid, students: [...data.students] } }
    );

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
  postmsg,
};
