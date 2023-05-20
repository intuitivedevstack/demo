import User from "../models/userModel.js";
import catchErrorAsync from "../utils/catchErrorAsync.js";
import nodemailer from "nodemailer";
import {
  authTokenCreation,
  authTokenVerification,
} from "../utils/jwtTokenProcess.js";
import ApiErrorModel from "../utils/apiErrorModel.js";
import jwt from "jsonwebtoken";

const signUp = catchErrorAsync(async (req, res, next) => {
  const {
    fullName,
    InstituteName,
    contactNumber,
    email,
    password,
    passwordConfirmation,
  } = req.body;

  const data = await User.create({
    fullName,
    InstituteName,
    contactNumber,
    email,
    password,
    passwordConfirmation,
  });

  const token = authTokenCreation(data._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRY) * 24 * 60 * 60 * 1000
    ),
  });

  res.status(201).json({
    status: "Success",
    data,
    token,
  });
});

const signIn = catchErrorAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiErrorModel("Please provide email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new ApiErrorModel("Incorrect credentials", 401));
  }

  const token = authTokenCreation(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRY) * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    // httpOnly: true
  });

  res.status(200).json({
    status: "Success",
    token,
  });
});

const protect = catchErrorAsync(async (req, res, next) => {
  let token = "";

  if (req.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiErrorModel("Not authorized", 401));
  }

  const payload = await authTokenVerification(token);

  const userInfo = await User.findById(payload.id);
  if (!userInfo) {
    return next(new ApiErrorModel("The user does not exist", 401));
  }

  if (userInfo.invalidateTokens(payload.iat)) {
    return next(new ApiErrorModel("Login again", 401));
  }

  req.user = userInfo;

  next();
});

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Password Reset Request",
      html: `
      <p>Please click the link below to reset your password:</p>
      <a href="https://fs-six.vercel.app/resetpassword/${token}">Reset Password</a>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({
      message: "Password reset link has been sent to your email address",
    });
  } catch (err) {
    console.log(err);
  }
};

const resetPasswordToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, passwordConfirmation } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.password = password;
    user.passwordConfirmation = passwordConfirmation;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export {
  signUp,
  signIn,
  resetPassword,
  resetPasswordToken,
  protect,
  getUserById,
};
