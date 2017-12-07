/**
 * Created by ollie on 2017/12/4.
 */
const express = require('express');
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

    router.use('/',require('./login')());
    router.use('/banners',require('./banners')());
    return router;
}