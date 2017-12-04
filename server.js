/**
 * Created by ollie on 2017/12/4.
 */
const express = require('express');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerObj = multer({dest: './static/upload'});
const app = express();

app.use(multerObj.any());
app.use(cookieParser());
var keys = [];
for (var i = 0; i < 100000; i++) {
    keys[i]='a_' + Math.random();
}
app.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20 * 60 * 1000 //20min
}));

app.engine('html',consolidate.ejs);
app.set('views','template');
app.set('view engine','html');
app.use(express.static('./static/'));
app.use('/',require('./route/web/web.js')());
app.use('/admin',require('./route/admin/admin.js')());
app.listen(8080);