/**
 * Created by ollie on 2017/12/7.
 */
const express=require('express');
const mysql = require('mysql');
const config=require('../../config');
var db = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
module.exports=function () {
    var router = express.Router();

    router.get('/',(req,res)=>{
        db.query(`SELECT * FROM banner_table`,(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send('database error').end();
            }else{
                if (data.length == 0) {
                    res.status(404).send('no more data').end();
                }else{
                    res.render('admin/banners.ejs',{layout:'admin/layout.ejs',title:'banners',username:req.session.username,banners:data});
                }
            }
        });
    });
    router.post('/addnew',(req,res)=>{
        var title=req.body.title;
        var description=req.body.description;
        var href=req.body.href;
        if(title!==''||description!==''||href!==''){
            res.status(200).send({
                code:0,
                msg:'form must be not empty'
            }).end();
        }
    });
    return router;
}