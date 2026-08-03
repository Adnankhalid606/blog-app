import api from "./api";

export async function loginUser(email, password) {
  return await api.post("/user/login", {
    email,
    password,
  });
}
export async function refreshToken() {}
export async function getCurrentUser() {}
