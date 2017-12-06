/**
 * Created by ollie on 2017/12/4.
 */
const express = require('express');
const common = require('../../libs/common');
const mysql = require('mysql');
const os = require('os');
var db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'learn'
});
module.exports = function () {
    var router = express.Router();
    //检查登录状态
    router.use((req, res, next)=> {
        if (!req.session['admin_id'] && req.url != '/login') {
            res.redirect('/admin/login');
        } else {
            next();
        }
    });
    router.post('/login', (req, res)=> {
        var username = req.body.username;
        var password = common.md5(req.body.password + common.MD5_SUFFIX);
        db.query(`SELECT * FROM admin_table WHERE username='${username}'`, (err, data)=> {
            if (err) {
                console.log(err);
                res.status(500).send('database error').end();
            } else {
                if (data.length == 0) {
                    res.status(404).send('no this admin').end();
                } else {
                    if (data[0].password == password) {
                        req.session['admin_id']=data[0].ID;
                        req.session['username']=data[0].username;
                        res.redirect('/admin');

                    } else {
                        res.status(404).send('This password is not incorrect!').end();
                    }
                }
            }
        });
    });
    router.get('/login',(req,res)=>{
        res.render('admin/login.ejs',{layout:'/admin/layout.ejs',title:'Login'});
    });
    router.get('/logout',(req,res)=>{
        req.session=null;
        res.redirect('/admin/login');
    });
    router.get('/',(req,res)=>{
        res.render('admin/index.ejs',{
            layout:'/admin/layout.ejs',
            title:'Home',username:req.session.username,
            hostname:os.hostname(),
            type:os.type(),
            time:new Date(),
            release:os.release()
        });
    });
    router.get('/banners',(req,res)=>{
        res.render('admin/banners.ejs',{layout:'/admin/layout.ejs',title:'banners',username:req.session.username});
    });
    return router;
}