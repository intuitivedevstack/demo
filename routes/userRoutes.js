import express from "express";
import {
  signUp,
  signIn,
  resetPassword,
  resetPasswordToken,
  getUserById,
} from "../controllers/userControllers.js";

const routerAuth = express.Router();

routerAuth.route("/signup").post(signUp);
routerAuth.route("/signin").post(signIn);
routerAuth.route("/resetpassword").post(resetPassword);
routerAuth.route("/resetpassword/:token").post(resetPasswordToken);
routerAuth.route("/getuserbyid/:id").get(getUserById);

export default routerAuth;
