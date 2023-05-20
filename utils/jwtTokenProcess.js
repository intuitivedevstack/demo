import jwt from "jsonwebtoken";

export const authTokenCreation = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const authTokenVerification = async (token) => {
  return await jwt.verify(token, process.env.JWT_SECRET_KEY);
};
