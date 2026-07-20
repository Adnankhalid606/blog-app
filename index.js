import express from "express";
import morgan from "morgan"
import cookieParser from "cookie-parser";
import blogRoutes from "./routes/blogRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from './routes/adminRoutes.js'
import authorRequest from './routes/authorApplicationRoutes.js';
import errorMiddleware from "./middleware/errorMiddleware.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use('/api/blogs', blogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/author", authorRequest);

app.use(errorMiddleware);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
