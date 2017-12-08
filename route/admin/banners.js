/**
 * Created by ollie on 2017/12/7.
 */
const express = require('express');
const mysql = require('mysql');
const config = require('../../config');
var db = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
module.exports = function () {
    var router = express.Router();

    router.get('/', (req, res)=> {
        db.query(`SELECT * FROM banner_table`, (err, data)=> {
            if (err) {
                console.log(err);
                res.status(500).send('database error').end();
            } else {
                if (data.length == 0) {
                    res.status(404).send('no more data').end();
                } else {
                    res.render('admin/banners.ejs', {
                        layout: 'admin/layout.ejs',
                        title: 'banners',
                        username: req.session.username,
                        banners: data
                    });
                }
            }
        });
    });
    router.post('/addnew', (req, res)=> {
        var title = req.body.title;
        var description = req.body.description;
        var href = req.body.href;
        if (title == '' || description == '' || href == '') {
            res.status(200).send({
                code: 400,
                msg: 'form must be not empty'
            }).end();
        } else {
            db.query(`INSERT INTO banner_table (title,description,href) VALUES ('${title}','${description}','${href}')`, (err, data)=> {
                if (err) {
                    console.log(err);
                    res.send({code: 500, msg: 'databases error!'});
                } else {
                    res.send({code: 0, msg: 'success'});
                }
            })
        }
    });
    router.get('/fetchone/:id',(req,res)=>{
        var id = req.params.id;
        db.query(`SELECT * FROM banner_table WHERE ID='${id}'`, (err, data)=> {
            if (err) {
                console.log(err);
                res.send({
                    code: 500,
                    msg: 'database error!'
                });
            } else {
                if (data.length == 0) {
                    res.send({
                        code: 404,
                        msg: 'this id is not found'
                    });
                } else {

                    res.send({
                        code: 0,
                        data:{
                            title:data[0].title,
                            description:data[0].description,
                            href:data[0].href
                        },
                        msg:'done!'
                    });
                }
            }
        });
    });
    router.post('/edit/:id', (req, res)=> {
        var id = req.params.id;
        var title = req.body.title;
        var description = req.body.description;
        var href = req.body.href;
        let promise = new Promise(function (resolve, reject) {
            db.query(`SELECT * FROM banner_table WHERE ID='${id}'`, (err, data)=> {
                if (err) {
                    console.log(err);
                    res.send({
                        code: 500,
                        msg: 'database error!'
                    });
                } else {
                    if (data.length == 0) {
                        res.send({
                            code: 404,
                            msg: 'this id is not found'
                        });
                    } else {

                        if (title == '' || description == '' || href == '') {
                            res.send({
                                code: 400,
                                msg: 'form data must be not empty'
                            });
                        } else {
                            resolve({id, title, description, href})
                        }
                    }
                }
            });

        });
        promise.then((obj)=> {
            db.query(`UPDATE banner_table SET title='${obj.title}',description='${obj.description}',href='${obj.href}' WHERE ID='${obj.id}'`, (err, data)=> {
                if (err) {
                    console.log(err);
                    res.send({
                        code: 500,
                        msg: 'database error!'
                    });
                } else {
                    res.send({
                        code: 0,
                        msg: 'edit one success!'
                    });
                }
            });
        });

    });
    router.post('/delete/:id', (req, res)=> {
        var id = req.params.id;
        let promise = new Promise(function (resolve, reject) {
            db.query(`SELECT * FROM banner_table WHERE ID='${id}'`, (err, data)=> {
                if (err) {
                    console.log(err);
                    res.send({
                        code: 500,
                        msg: 'database error!'
                    });
                } else {
                    if (data.length == 0) {
                        res.send({
                            code: 404,
                            msg: 'this id is not found'
                        });
                    } else {
                        resolve(id);
                    }
                }
            });

        });
        promise.then((id)=> {
            db.query(`DELETE FROM banner_table WHERE ID='${id}'`, (err, data)=> {
                if (err) {
                    console.log(err);
                    res.send({
                        code: 500,
                        msg: 'database error!'
                    });
                } else {
                    res.send({
                        code: 0,
                        msg: 'delete done'
                    });
                }
            });
        });
    });
    return router;
}