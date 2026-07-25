import mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,   
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

try{
    const connection = await db.getConnection();
    console.log("Database Connected");
    connection.release();
}
catch(err){
    console.error('Error connecting to the database:', err);
}

export default db;
