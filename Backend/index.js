import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authorRequest from "./routes/authorApplicationRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { validateEnv } from "./config/envValidation.js";

// Validate environment variables on startup
validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigin = process.env.CLIENT_URL;

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join("uploads")));
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

app.use("/api/blogs", blogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/author", authorRequest);

app.use(errorMiddleware);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
