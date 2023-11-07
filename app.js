require('dotenv').config()
const mysql = require('mysql2/promise');

const conf = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

connect();

async function connect(){
    try {
        const con = await mysql.createConnection(conf);
        await con.execute("INSERT INTO product_category VALUES ('Books', 'Interesting books')");
    } catch (error) {
        console.log(error.message);
    }
}