import api from "./api";
export const applyForAuthor = (reason) =>
  api.post("/author/application", { reason });
export const cancelAuthorApplication = () =>
  api.patch("/author/application/cancel");
