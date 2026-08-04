import api from "./api";
export const loginUser = (email, password) =>
  api.post("/user/login", { email, password });
export const refreshToken = () => api.post("/user/refresh-token");
export const getCurrentUser = () => api.get("/user/me");
export const logoutUser = () => api.post("/user/logout");
export const registerUser = (data) => api.post("/user/register", data);
export const verifyEmail = (email, otp) =>
  api.post("/user/verify-email", { email, otp });
export const resendVerificationEmail = (email) =>
  api.post("/user/resend-verification", { email });
export const requestPasswordReset = (email) =>
  api.post("/user/forgot-password", { email });
export const resetPassword = (email, otp, password) =>
  api.post("/user/reset-password", { email, otp, password });
