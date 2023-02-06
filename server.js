const express = require('express');
const cookieParser = require("cookie-parser");
const sqlite3 = require('sqlite3');
const sessions = require('express-session');
const e = require('express');
const bodyParser = require('body-parser');

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
app.use(bodyParser.urlencoded({extended: true}));

app.use(sessions({
    secret: 'OriAndTheBlindForest',
    resave: false,
    saveUninitialized: false
  }));

const indexRouter = require('./routes/index')
const indexlogRouter = require('./routes/index_log')
const redeemRouter = require('./routes/redeem')
const reglogRouter = require('./routes/reglog')
const collectionRouter = require('./routes/collection')

app.use('/' , indexRouter)
app.use('/log' , indexlogRouter)
app.use('/redeem' , redeemRouter)
app.use('/reglog' , reglogRouter)
app.use('/collection' , collectionRouter)

app.listen(port)