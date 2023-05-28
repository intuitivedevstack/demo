import "./config.js";

import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import router from "./routes/studentRoutes.js";
import routerAuth from "./routes/userRoutes.js";
import globalErrorHandling from "./controllers/errorController.js";
import multer from "multer";
import student from "./models/studentModel.js";
import file from "./models/fileModel.js";

const DBConnectionString = process.env.DB_CONNECTION_STRING;

mongoose
  .connect(DBConnectionString)
  .then(() => console.log("Connected to Database !"))
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(
  morgan((token, req, res) => {
    return [
      `Method Name: ${token.method(req, res)}`,

      `Status Code: ${token.status(req, res)}`,

      `User name: ${req.headers.user}`,

      `Client name: ${req.headers["client-name"]}`,
    ];
  })
);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/cool/working", (req, res) => {
  res.send("cool working !");
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/uploadphoto", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const { studentId } = req.query;
  try {
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(req.file.buffer))
    );

    const data = await file.findOne({ studentid: studentId });

    if (data) {
      await file.updateOne(
        { studentid: studentId },
        {
          studentid: studentId,
          photo: {
            data: base64String,
            fileName: req.file.originalname,
          },
        }
      );
    } else {
      await file.create({
        studentid: studentId,
        photo: {
          data: base64String,
          fileName: req.file.originalname,
        },
      });
    }

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
});

app.post("/api/postmsg", async (req, res) => {
  try {
    let data;
    if (req.body.classVal === "All") {
      data = await student.find();
    } else {
      data = await student.find({ cls: req.body.classVal });
    }

    data.map(async (ele) => {
      const isdata = await file.findOne({ studentid: ele._id });

      if (isdata) {
        await file.updateOne(
          { studentid: ele._id },
          {
            studentid: ele._id,
            msg: req.body.msg,
          }
        );
      } else {
        await file.create({
          studentid: ele._id,
          msg: req.body.msg,
        });
      }
    });

    res.json({
      status: "Successfully Sent Message !",
    });
  } catch (err) {
    res.json({
      status: "error",
      message: err.message,
    });
  }
});

app.post("/api/postpdf", upload.single("pdf"), async (req, res) => {
  let classVal = JSON.parse(req.body.classVal);

  const base64String = btoa(
    Array.from(new Uint8Array(req.file.buffer))
      .map((b) => String.fromCharCode(b))
      .join("")
  );

  try {
    let data;
    if (classVal === "All") {
      data = await student.find();
    } else {
      data = await student.find({ cls: classVal });
    }

    data.map(async (ele) => {
      const isdata = await file.findOne({ studentid: ele._id });

      if (isdata) {
        await file.updateOne(
          { studentid: ele._id },
          {
            pdf: {
              data: base64String,
              fileName: req.file.originalname,
            },
          }
        );
      } else {
        await file.create({
          studentid: ele._id,
          pdf: {
            data: base64String,
            fileName: req.file.originalname,
          },
        });
      }
    });

    res.json({
      status: "Successfully Uploaded !",
    });
  } catch (err) {
    res.json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/api/getfile", async (req, res) => {
  const { studentId } = req.query;

  try {
    let data;

    if (studentId) {
      data = await file.findOne({ studentid: studentId });
    } else {
      data = await file.find();
    }

    res.json({
      status: "Success !",
      length: data.length,
      data,
    });
  } catch (err) {
    res.json({
      status: "error",
      message: err.message,
    });
  }
});

app.use("/api", router);
app.use("/auth", routerAuth);
app.use(globalErrorHandling);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
