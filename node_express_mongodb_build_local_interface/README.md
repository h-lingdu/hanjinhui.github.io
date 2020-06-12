#node
#这是我的 node 服务器

#这是后端接口文件

#只提供接口


mongoDB 数据库 操作

1. 安装 mongoDB
    1. 选择 custome
    2. 修改安装地址  C:\MongoDB
    3. 修改环境变量  找到 bin 路径  C:\MongoDB\bin 配置到全局环境变量 

2. 启动mongo
    1. 进入mongoDB 目录 ,新建 data ,保存数据
    2. 进入 data, 在data内新建 db 文件夹 保存数据库数据
    3. 执行 mongod --dbpath C:\MongoDB\data\db 
    4. port 27017  浏览器输入 http://localhost:27017/ 成功打开
    5. 新建cmd 输入 mongo 进入mongoDB Shell


3. 创建 MongoDB  服务 (必须管理器权限)
    1. 切换到 Mongodb 的 data 下,新建一个log 文件夹 ,存储登录日志
    2. 切换到 data 下的 log ,新建 一个文件 mongo.log 存储登录日志
    3. 切换到 C:\MongoDB 新建 mongo.config 配置文件 
      dbpath=C:\MongoDB\data\db
      logpath=C:\MongoDB\data\log\mongo.log
    4. 新建cmd  输入  mongod --config C:\MongoDB\mongo.config (启动mongodb)   
    5. 创建 mongodb 服务 mongod --config C:\MongoDB\mongo.config --install --serviceName "MongoDB"
    6. 启动 mongodb  服务 net start MongoDB

4. mognodb
MongoDB是一个基于分布式文件存储的数据库。由C++语言编写。旨在为WEB应用提供可扩展的高性能数据存储解决方案。
它的特点:高性能、易部署、易使用，存储数据非常方便。


SQL                        mongodb
database                  database/db
table 表                  collection 集合
row   行                  document  文档
column 列                 field      域名
index                     index
table join                不支持
primary key                _id

collection  集合
集合存在于数据库中，集合没有固定的结构，这意味着你在对集合可以插入不同格式和类型的数据，但通常情况下我们插入集合的数据都会有一定的关联性。

document 文档

文档是一个键值(key-value)对(即BSON)。MongoDB 的文档不需要设置相同的字段，并且相同的字段不需要相同的数据类型，这与关系型数据库有很大的区别，也是 MongoDB 非常突出的特点

数据类型
string 
integer
boolean
double
array
max min(key)
timestamp	
object
null
symbol

常用指令
mongo 进入mongodb Shell
show dbs 显示所有的数据库
db 查看当前数据库
db.getName()
use cd1706 创建或者切换数据库
查看命令提示
help
db.help()
db.test.help()
db.test.find().help()

显示当前DB状态
db.stats()
查看当前DB版本
db.version()
查看当前DB的链接机器地址
db.getMongo()
删除数据库
db.dropDatabase()


show collections 显示当前数据库内的集合
db.emp.save()  保存数据 如果第一次就是直接创建集合  
db.userinfo.insert()


创建一个聚集集合
db.createCollection("collName", {size: 20, capped: true, max: 100});
db.collName.isCapped(); //判断集合是否为定容量
得到指定名称的聚集集合
db.getCollection("account");
得到当前db的所有聚集集合
db.getCollectionNames();   返回是数组 
显示当前db所有聚集的状态
db.printCollectionStats();


5. MongoDB 增删改查 
查   find  
增   insert({},[])   insertOne  insertMany save()
改   update updateOne updateMany
删除   deleteOne deleteMany remove


插入
db.userinfo.insert()   db.userinfo.insert({username:"mingming"})  db.userinfo.insert([{username:"huahua"},{username:"pengzhan"}])
db.userinfo.insertOne() obj 只能插入一条数据
db.userinfo.insertMany()  array 只能接受数组  
db.userinfo.save()  类似 insert 

修改  update
update set user password = 'abc123'  where  id  > 4;
update set user password = "abc123" where username = "mimgming"
db.test.update(query,object);
db.userinfo.update({username:"mingming"},{
    $set:{
        password:"abc123"
    }
}
update userinfo set password = "abc123" where username = "mingming";
db.userinfo.update({password:"123"},{
    $set:{
        username:"zuozuomu"
    }
})
db.user.update(
{password:"abc123"},
{$set:{
    username:"dadazuo"
}}
)
修改第一条数据
db.userinfo.update({},{
    $set:{
        password:"abc123"
    }
})

db.userinfo.update({username:"cd1706"},{
    $set:{
        password:"abc123"
    }
},true);
能不能查询到  (查不到)
true  查不到就直接插入
false 查不到就不插入 

修改多条数据 
db.userinfo.update({},{
    $set:{
        password:"abcd12456"
    }
},true,true);
true 表示修改满足条件的所有数据    updateMany
false 表示修改满足条件的第一条数据  updateOne

db.userinfo.updateOne({
},{
    $set:{
        age:28
    }
});
db.userinfo.updateMany({},{
    $inc:{
        age:12
    }
});


删除  deleteOne
db.userinfo.deleteOne({
    username:"zuozuomu"
})      删除一条数据 

db.userinfo.deleteMany()  删除多条数据 
db.userinfo.remove(query)   删除所有满足条件 的 文档 
db.userinfo.remove(query,n);   表示删除的数据量     n 只能删除一条数据  第一条数据

db.userinfo.drop();  删除集合 collection 

db.users.findAndModify({
    query: {age: {$gte: 25}}, 
    sort: {age: -1}, 
    update: {$set: {name: 'a2'}, $inc: {age: 2}},
    remove: true
});

db.userinfo.findAndModify({
    query:{username:"pengzhan"},
    sort:{age:-1},
    update:{
        $set:{
            tel:13812341234,
        },
        $inc:{
            age:16
        }
    },
    remove:false
})


查询  find 
db.userinfo.find() 查询所有  select * from userinfo where password = "abc123";
db.userinfo.find({query},{field})    
db.userinfo.find({username:"pengzhan"})
db.userinfo.find({username:"pengzhan"},{username:1,_id:0,password:1});  1表示显示 0不显示
select username,password from userinfo;
db.userinfo.find({age:24})

去重查询 
 db.user.distinct("password")
select distinct password from user;


$gt   great then > 
$gte  great then equal >=
$lt   less then  <
$lte  less then equal <= 

db.userinfo.find({
    age:{$gt:25}
})
db.userinfo.find({
    age:{$gt:20,$lte:30}
})

$set
$inc
$or  or  

db.user.find(
    {
        $or:[
            {
                username:"pengzhan"
            },
            {
                age:{
                    $lte:40
                }
            }
        ]
    },
    {
        _id:0
    }
)
select username ,password,age from user where username = "pengzhan" or age <=40;  

模糊查询  like 
select * from userinfo where username like 'hua%';
db.userinfo.find({username:/^hua/});
db.userinfo.find({username:/^hua$/});
db.userinfo.find({username:/hua4$/});

new RegExp("hua4$");
db.userinfo.find({username:new RegExp("^hua")});


https://douban.uieee.com/v2/movie/top250  ===> subjects 

db.movie.find({query},{field})  query 查询条件  field 查询的字段
db.movie.find({},{title:1,year:1}) 
select title ,year from movie;
db.movie.find({},{title:1,year:1,_id:0}) 1 显示 0 不显示 
db.movie.find({},{title:1,_id:0,genres:1})
db.movie.find({},{title:1,_id:0,"rating.average":1})

db.movie.find({year:{$gt:"1994",$lt:"2017"}},{title:1,year:1,_id:0})
db.movie.find({year:"1994"},{title:1,year:1,_id:0,genres:1});
db.movie.find({"rating.average":{$gte:9.3}},{year:1,title:1,_id:0,'rating.average':1})
db.movie.find({"rating.average":{$gte:9.3},year:"1994"},{year:1,title:1,_id:0,'rating.average':1})
db.movie.find({},{year:1,title:1,"directors.name":1});

排序
db.movie.find({},{year:1,title:1,_id:0}).sort({year:1})  1表示升序
db.movie.find({},{year:1,title:1,_id:0}).sort({year:-1})  -1 降序 

 db.movie.find({},{year:1,title:1,_id:0,"rating.average":1}).sort({year:-1,"rating.average":-1})
 db.movie.find({},{year:1,title:1,_id:0,"rating.average":1}).sort({year:-1,"rating.average":1})
 
 限制条数  limit 
db.movie.find({},{year:1,title:1,_id:0}).limit(10);

跳过 skip 
db.movie.find({},{year:1,title:1,_id:0}).skip(5);
db.movie.find({},{year:1,title:1,_id:0}).skip(5).limit(10);
db.movie.find({},{year:1,title:1,_id:0}).limit(10).skip(5);

长度  条数 count所有的集合数据，size满足条件的数据
db.movie.find({},{year:1,title:1,_id:0}).size();
db.movie.find({},{year:1,title:1,_id:0}).count();
db.movie.find({},{year:1,title:1,_id:0}).skip(5).size();   15
 db.movie.find().skip(5).count()  20 

最大值   
db.movie.find({},{year:1,title:1,_id:0}).max({"rating.average"})
db.movie.find({},{year:1,title:1,_id:0}).min({"rating.average"})

db.movie.aggregate({$group:{"_id":"min",min_value:{$min:'$year'}}})
db.movie.aggregate({$group:{'_id':"max",max_value:{$max:'$year'}}})
 db.movie.aggregate({$group:{"_id":"year",max_value:{$max:"$year"}}})
 db.movie.aggregate({$group:{"_id":"year",min_value:{$min:"$year"}}})


or $or 查询
select * from userinfo where age = 22 or age =28;
select * from userinfo where age in (22,28);

db.movie.find({$or:[{year:"1994"},{year:"1997"}]},{year:1,title:1,_id:0})

and  查询

db.movie.find({year:"1994","rating.average":9.6},{year:1,title:1,_id:0})

查询第一条数据  
db.movie.findOne({},{year:1,title:1}) 
db.movie.find().limit(1);

判断 列 field 是否存在
db.movie.find({year:{$exists:true}},{year:1,title:1,_id:0})
db.movie.find({year11:{$exists:true}},{year:1,title:1,_id:0})

$in  包含
db.movie.find({genres:{$in:["犯罪"]}},{year:1,title:1,genres:1,_id:0})
in 
select * from movie where genres in [ "犯罪"]
$nin  不包含 
db.movie.find({genres:{$nin:["剧情"]}},{year:1,title:1,genres:1,_id:0})
in

$inc ++ update
db.movie.update({},{
    $inc:{
        year:"1"
    }
})




