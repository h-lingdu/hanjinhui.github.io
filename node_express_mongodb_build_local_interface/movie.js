var express = require("express");

var router = express.Router();
var { waterfall, series } = require("async");
var { conn } = require("./db");
// const md5 = require("md5-node");
// const axios = require("axios");

router.get("/", (req, res) => {
    res.send("这是我项目的接口地址 ")
})


router.get("/getdata", (req, res) => { //获取所有电影数据
    var { pagesize, pagenum, title, rate, year } = req.query;
    console.log('req.query', req.query)
    var total = 0; //数据总数
    var obj = {};
    if (title) { //模糊查询title(使用电影名)
        obj = { title: new RegExp(title) };
    }
    var sortObj = {}
    if (parseInt(rate) === -1) {
        sortObj['rating.average'] = parseInt(rate)
    }
    if (parseInt(year) === -1) {
        sortObj['year'] = parseInt(year)
    }
    console.log(sortObj)
    pagesize = parseInt(pagesize) || 10;  //每页显示的条数
    pagenum = parseInt(pagenum) || 0;     //当前页面
    conn((err, db) => {
        if (err) throw err;
        series([//串行无关联
            function (callback) {//查总条数
                db.collection('movieinfo').find(obj, {}).toArray((err, arr) => {
                    if (err) throw err;
                    total = arr.length;
                    if (total > 0) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                })
            },
            function (callback) {
                if (total > 0) {
                    db.collection('movieinfo').find(obj,
                        {
                            _id: 0, // 数据库自带的，不需要显示
                            rating: 1,  //评分
                            genres: 1,  //类型
                            title: 1,  //电影名
                            directors: 1, //导演
                            year: 1,  //年份
                            images: 1, //图片
                            id: 1    //电影id，用于查详情
                        }).skip(pagesize * pagenum).limit(pagesize).sort(sortObj).toArray((err, result) => {
                            if (err) throw err;
                            callback(null, result);
                        })
                } else {
                    callback(null, []);
                }
            }
        ], (err, result) => {
            if (err) throw err;
            res.json({
                result: result[1],
                total
            })
            db.close()
        })
    })
})

module.exports = router;