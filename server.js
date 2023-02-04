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

app.use(express.static(__dirname + '/public'));

const indexRouter = require('./routes/index')
const indexlogRouter = require('./routes/index_log')

app.use('/' , indexRouter)
app.use('/log' , indexlogRouter)

app.listen(port)