import express from "express";
import morgan from "morgan"
import blogRoutes from "./routes/blogRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import errorMiddleware from "./middleware/errorMiddleware.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(morgan("dev"));

app.use('/api/blogs', blogRoutes);
app.use('/api/user', userRoutes);

app.use(errorMiddleware);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
