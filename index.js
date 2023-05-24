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
    cb(null, "tmp/");
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
      req.protocol + "://" + req.get("host") + "/tmp/" + req.file.filename;

    findData.photo = {
      url: imageUrl,
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
// app.use("/uploads", express.static("uploads"));
const __dirname = path.resolve();
app.use("/tmp", express.static(path.join(__dirname, "/tmp")));
app.use(globalErrorHandling);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
