import * as userServices from "../services/userServices.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      status: false,
      message: "Please enter username, email and password",
    });
  }
  try {
    const existingUser = await userServices.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userID = await userServices.createUser(
      username,
      email,
      hashedPassword,
    );
    const token = generateToken(userID);
    res.status(200).json({
      status: true,
      message: "User created successfully",
      token: token,
      user: {
        id: userID,
        username: username,
        email: email,
      },
    });
  } catch (err) {
    next(err);
  }
};
