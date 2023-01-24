const express = require('express');
const cookieParser = require("cookie-parser");
const sqlite3 = require('sqlite3');
const sessions = require('express-session');
const e = require('express');

const db = new sqlite3.Database('Karty.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

const app = express();
const port = 3000
app.set("view engine" , "ejs")

const indexRouter = require('./routes/index')

app.use('/' , indexRouter)

app.listen(port)