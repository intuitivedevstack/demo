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
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

let tempraryImageDirectory;

if (process.env.NODE_ENV && process.env.NODE_ENV == "production") {
  tempraryImageDirectory = path.join(__dirname, `/tmp/`);
} else {
  tempraryImageDirectory = "/tmp/";
}

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, tempraryImageDirectory));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/uploadphoto", upload.single("photo"), async (req, res) => {
  console.log("fire");
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const { studentId, userid } = req.query;
  try {
    const data = await student.findOne({ userid });

    const findData = data.students.find((ele) => ele.id == studentId);

    const imageUrl =
      req.protocol +
      "://" +
      req.get("host") +
      tempraryImageDirectory +
      req.file.filename;

    findData.photo = {
      name: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
      url: imageUrl,
      path: req.file.path,
    };

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
});

app.use("/api", router);
app.use("/auth", routerAuth);
app.use(express.static(__dirname));
app.use(globalErrorHandling);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
