import * as userServices from "../services/userServices.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import verifyToken from "../utils/verifyToken.js";
import { sendEmail } from "../utils/email.js";
import { generateOtp, getOtpHtml } from "../utils/generateOtp.js";

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
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userServices.createUser(
      username,
      email,
      hashedPassword,
    );

    const otp = await generateOtp();
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const html = await getOtpHtml(otp);
    await userServices.createOtp(email, userId.id, hashedOtp);
    await sendEmail(email, "Verify your email", "Verify your email", html);

    res.status(200).json({
      status: true,
      message: "User created successfully",
      user: {
        id: userId.id,
        username: userId.username,
        email: userId.email,
        verified: userId.verified,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await userServices.findUserById(req.user.id);
    res.status(200).json({
      status: true,
      message: "User found successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "Please enter email and password" });
  }
  try {
    const user = await userServices.findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Email or Password is invalid" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ status: false, message: "Email or Password is invalid" });
    }
    if (!user.verified) {
      return res
        .status(401)
        .json({ status: false, message: "Please verify your email" });
    }
    const accessToken = await generateToken(user.id, "15m");
    const refreshToken = await generateToken(user.id);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await userServices.createSession(
      user.id,
      hashedRefreshToken,
      req.ip,
      req.headers["user-agent"],
    );
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: true,
      token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const refreshToken = req.refreshToken;
    const activeSessions = await userServices.getSessionsByUserID(userId);
    let isValidSession = false;
    for (const session of activeSessions) {
      const matchedSession = await bcrypt.compare(
        refreshToken,
        session.refresh_token_hash,
      );
      if (matchedSession) {
        isValidSession = true;
        break;
      }
    }
    if (!isValidSession) {
      return res
        .status(401)
        .json({ status: false, message: "Session expired or revoked" });
    }
    const accessToken = await generateToken(userId, "15m");
    res.status(200).json({
      status: true,
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logOut = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const refreshToken = req.refreshToken;
    const userSessions = await userServices.getSessionsByUserID(userId);

    let matchedSessionId = null;
    for (const session of userSessions) {
      const isMatched = await bcrypt.compare(
        refreshToken,
        session.refresh_token_hash,
      );
      if (isMatched) {
        matchedSessionId = session.id;
        break;
      }
    }
    if (matchedSessionId) {
      await userServices.revokeSession(matchedSessionId);
    }

    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ status: true, message: "Logout successfully" });
  } catch (err) {
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    next(err);
  }
};

export const logoutAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const refreshToken = req.refreshToken;
    const userSessions = await userServices.getSessionsByUserID(userId);
    let currentSessionId = null;
    for (const session of userSessions) {
      const isMatched = await bcrypt.compare(
        refreshToken,
        session.refresh_token_hash,
      );
      if (isMatched) {
        currentSessionId = session.id;
        break;
      }
    }
    if (currentSessionId) {
      await userServices.revokeAllSession(userId, currentSessionId);
    }
    res.status(200).json({
      status: true,
      message: "Successfully logged out of all other devices.",
    });
  } catch (err) {
    next(err);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ status: false, message: "Email is required" });
  try {
    const user = await userServices.findUserByEmail(email);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });
    const otp = await generateOtp();
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const html = `<p>Your password reset code is:</p><h2>${otp}</h2><p>Enter this code in BlogSpace to reset your password.</p>`;
    await userServices.deleteOtpByEmail(email);
    await userServices.createOtp(email, user.id, hashedOtp);
    await sendEmail(email, "Reset your BlogSpace password", "Your password reset code is " + otp, html);
    res.status(200).json({ status: true, message: "Password reset code sent" });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) return res.status(400).json({ status: false, message: "Email, OTP and password are required" });
  if (password.length < 6) return res.status(400).json({ status: false, message: "Password must be at least 6 characters" });
  try {
    const otpRecord = await userServices.getOtpByEmail(email);
    if (!otpRecord) return res.status(400).json({ status: false, message: "OTP not found. Request a new code." });
    const isMatch = await bcrypt.compare(otp.toString(), otpRecord.otp_hash);
    if (!isMatch) return res.status(400).json({ status: false, message: "Invalid OTP" });
    const user = await userServices.findUserByEmail(email);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await userServices.updatePassword(user.id, hashedPassword);
    await userServices.deleteOtpByEmail(email);
    res.status(200).json({ status: true, message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: false, message: "Email is required" });
  }
  try {
    const user = await userServices.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    if (user.verified) {
      return res.status(400).json({ status: false, message: "Email is already verified" });
    }
    const otp = await generateOtp();
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const html = await getOtpHtml(otp);
    await userServices.deleteOtpByEmail(email);
    await userServices.createOtp(email, user.id, hashedOtp);
    await sendEmail(email, "Verify your email", "Verify your email", html);
    res.status(200).json({ status: true, message: "A new verification code was sent" });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { otp, email } = req.body;
  try {
    const findEmail = await userServices.getOtpByEmail(email);
    if (!findEmail) {
      return res
        .status(400)
        .json({ status: false, message: "Email not found" });
    }
    const isMatch = await bcrypt.compare(otp.toString(), findEmail.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }
    const user = await userServices.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }
    await userServices.updateVerified(user.id);
    const accessToken = await generateToken(user.id, "15m");
    const refreshToken = await generateToken(user.id);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await userServices.deleteOtpByEmail(email);
    const session = await userServices.createSession(
      user.id,
      hashedRefreshToken,
      req.ip,
      req.headers["user-agent"],
    );
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: true,
      token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (err) {
    next(err);
  }
};
