import mysql from 'mysql2/promise';

const db = await mysql.createPool({
    host: 'localhost',
    port: 3307,   
    user: 'root',
    password: '',
    database: 'blogs'
})

export default db;
