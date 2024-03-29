import express from "express";

import {
  insertstudent,
  getstudents,
  getstudentsByUserId,
  getstudentById,
  postfee,
  deletestudentById,
  deletefeeById,
  getfee,
} from "../controllers/studentControllers.js";

const router = express.Router();

router.route("/students").post(insertstudent).get(getstudents);

router.route("/getstudentsByUserId").get(getstudentsByUserId);
router.route("/getstudentsById").get(getstudentById);
router.route("/postfee").post(postfee);
router.route("/deletestudentById").delete(deletestudentById);
router.route("/deletefeeById").delete(deletefeeById);
router.route("/getfee").get(getfee);

export default router;
