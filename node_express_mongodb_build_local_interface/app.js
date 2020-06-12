var express = require("express");

var app = express();

const port = 5000;  //随便写，不要占用就行

const hostname = "localhost";  

var cookieParser = require('cookie-parser'); // 处理 cookies
var bodyParser = require('body-parser'); //  处理post 请求参数  新版express 把 bodyParser注入到express

app.use(bodyParser.json()); // 获取 post 的参数  req.post 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // 设置 cookies 中间件 

// 处理跨域方法 jsonp
app.all('*', function (req, res, next) {
    // res.header("Access-Control-Allow-Headers","Access-Control-Allow-Headers")
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    next();
});

var movie = require("./movie");


app.get("/", (req, res) => {
    res.send("这是我 后端的服务器 根路径 ");
})



app.use("/movie", movie);


app.listen(port, hostname, () => {
    console.log(`my server is running at http://${hostname}:${port}`)
})