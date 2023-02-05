const express = require('express')
const router = express.Router()
const loginMiddleware = require('../middleware/loginMiddleware')

router.use(loginMiddleware)

router.get('/' , (req , res) =>{
    res.render('index_log')
});

module.exports = router
