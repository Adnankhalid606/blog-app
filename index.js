import express from "express";
import fs from "fs/promises";
import crypto from "crypto";
import db from "./config/dbConnection.js"
import blogRoutes from "./routes/blogRoutes.js"
import errorMiddleware from "./middleware/errorMiddleware.js";
const app = express();
const PORT = 3000;
app.use(express.json());

app.use('/api/blogs', blogRoutes)


app.use(errorMiddleware);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
