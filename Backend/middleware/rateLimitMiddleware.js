import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 auth attempts per IP per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message:
      "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
});
