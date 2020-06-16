function Mine(tr, td, mineNum) {
    this.tr = tr; //行数
    this.td = td;  //列数
    this.mineNum = mineNum;  //雷的数量

    this.squares = []; //存储所有的方块信息，他是一个二维数组，按行与列的顺序，存取都使用行列的形式
    this.tds = [];  //存储所有的单元格的DOM
    this.surplusMine = mineNum; //剩余的雷数量
    this.allRight = false;  //右击标的小红旗是否全是雷，用来判断用户是否游戏成功

    this.parent = document.querySelector(".gameBox")
}

//生成n个不重复的数字
Mine.prototype.randomNum = function () {
    var square = new Array(this.tr * this.td);  //生成一个空数组，数量是格子的总数
    for (var i = 0; i < square.length; i++) {
        square[i] = i
    }
    square.sort(function () { return 0.5 - Math.random() });
    return square.splice(0, this.mineNum)

}
Mine.prototype.init = function () {
    var rn = this.randomNum(); //雷在格子中的位置
    var n = 0;  //用于找到格子相对于的索引
    for (var i = 0; i < this.tr; i++) {
        this.squares[i] = [];
        for (var j = 0; j < this.td; j++) {
            // this.squares[i][j]
            //取一个方块在数组中数据要使用行与列的形式去取，找方块周围的方块的时候要用坐标的形式去取，行与列的形式跟坐标的形式x，y刚好相反
            if (rn.indexOf(n) != -1) {
                //如果成立，说明现在循环的这个索引在雷的数组里找到了，表示这个索引相对应的是雷
                this.squares[i][j] = { type: 'mine', x: j, y: i }; //x,y表示坐标
            } else {
                this.squares[i][j] = { type: 'number', x: j, y: i, value: 0 };
            }
            n++;
        }
    }
    this.parent.oncontextmenu = function () { //阻止右键 （事件委托）
        return false
    }

    this.updateNum()
    this.createDom();

    //剩余雷数
    this.mineNumDom = document.querySelector('.mineNum');
    this.mineNumDom.innerHTML = this.surplusMine
}


// 创建表格
Mine.prototype.createDom = function () {
    var that = this;
    var table = document.createElement('table');
    for (var i = 0; i < this.tr; i++) {
        var domTr = document.createElement('tr');
        this.tds[i] = [];

        for (var j = 0; j < this.td; j++) {
            var domTd = document.createElement("td");

            domTd.pos = [i, j];   //把格子对应的行与列存到格子身上，为了下面通过这个值去数组里取到对应的数据
            domTd.onmousedown = function () {
                that.play(event, this); //that指的是实例对象，this指的是点击的那个td
            }

            this.tds[i][j] = domTd;  //把所有创建的td添加到数组中

            // if (this.squares[i][j].type == 'mine') {
            //     domTd.className = 'mine'
            // }
            // if (this.squares[i][j].type == 'number') {
            //     domTd.innerHTML = this.squares[i][j].value
            // }

            domTr.appendChild(domTd);
        }

        table.appendChild(domTr);
    }
    this.parent.innerHTML = '';
    this.parent.appendChild(table);
}
// 找某个方格周围的8个方格
Mine.prototype.getAround = function (square) {
    var x = square.x;
    var y = square.y;
    var result = []; //把找到的格子的坐标返回出去（二维数组）
    /*
        x-1,y-1     x,y-1       x+1,y-1
        x-1,y       x,y(当前)   x+1,y
        x-1,y+1     x,y+1       x+1,y+1
    */
    //通过坐标去循环九宫格
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (
                i < 0 ||   //格子超出了左边的范围
                j < 0 ||   //格子超出了上边的范围
                i > this.td - 1 ||   //格子超出了右边的范围
                j > this.tr - 1 ||   //格子超出了下边的范围
                (i == x && j == y) ||  //当前循环到的格子是自己本身
                this.squares[j][i].type == 'mine'  //周围的格子是雷
            ) {
                continue;
            }

            result.push([j, i]);   //要以行与列的形式返回出去，因为到时候需要用它去取数组里的数据
        }
    }
    return result;
}

//更新所有的数字
Mine.prototype.updateNum = function () {
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            //要更新的是雷周围的数字
            if (this.squares[i][j].type == 'number') {
                continue;
            }

            var num = this.getAround(this.squares[i][j]);  //获取到每一个雷周围的数字

            for (var k = 0; k < num.length; k++) {
                this.squares[num[k][0]][num[k][1]].value += 1
            }
        }
    }
}

//开始游戏
Mine.prototype.play = function (e, obj) {
    var that = this

    if (e.which == 1 && obj.className != 'flag') { //后面的条件是为了限制用户标了小红旗之后不能左键点击
        //点击的是左键
        // console.log(obj);
        var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
        var cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

        // console.log(curSquare)
        if (curSquare.type == 'number') {
            //用户点到数字
            obj.innerHTML = curSquare.value;
            obj.className = cl[curSquare.value];

            if (curSquare.value == 0) {  //点到数字0
                obj.innerHTML = ''; //数字0不显示

                function getAllZero(square) {

                    var around = that.getAround(square);   //找到了周围的n个格子
                    for (var i = 0; i < around.length; i++) {
                        var x = around[i][0]; //行
                        var y = around[i][1];  //列

                        that.tds[x][y].className = cl[that.squares[x][y].value];

                        if (that.squares[x][y].value == 0) {
                            //如果以某个格子为中心找到的格子值为0，那就需要接着调用函数(递归)
                            if (!that.tds[x][y].check) {
                                //给对应的td添加一个属性，这条属性用于决定这个格子有没有被找过，如果找过就为true，下一次就不再找
                                that.tds[x][y].check = true;
                                getAllZero(that.squares[x][y]);
                            }

                        } else {
                            //如果以某个格子为中心找到的四周格子值不为0，就显示出来
                            that.tds[x][y].innerHTML = that.squares[x][y].value;
                        }
                    }
                }

                getAllZero(curSquare)
            }

        } else {
            //用户点到雷了
            this.gameOver(obj)
        }
    }

    if (e.which == 3) {   //点击右键
        if (obj.className && obj.className != 'flag') {
            return
        }
        obj.className = obj.className == 'flag' ? '' : 'flag'
        if (this.squares[obj.pos[0]][obj.pos[1]].type == 'mine') {
            this.allRight = true;  //用户标的小红旗背后都是雷
        } else {
            this.allRight = false
        }
        if (obj.className == 'flag') {
            this.mineNumDom.innerHTML = --this.surplusMine;
        } else {
            this.mineNumDom.innerHTML = ++this.surplusMine;
        }
        if (this.surplusMine == 0) {
            //剩余雷的数量为0，表示用户已经标完小红旗，这时候要判断游戏是成功还是结束
            if (this.allRight) {
                alert('恭喜你！游戏通过');
            } else {
                this.gameOver()
                alert('游戏失败');
            }
        }

    }
}

//游戏失败函数
Mine.prototype.gameOver = function (clickTd) {
    //显示所有的雷
    //取消所有格子的点击事件
    //点中的雷添加一个样式
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'mine') {
                this.tds[i][j].className = 'mine'
            }

            this.tds[i][j].onmousedown = null;
        }
    }

    if (clickTd) {
        clickTd.style.backgroundColor = '#f00'
    }
}


//button点击
var btns = document.querySelectorAll('.level button')
var mine = null; //用来存储生成的实例
var ln = 0;  //用来处理当前选中的状态
var arr = [[9, 9, 10], [16, 16, 40], [28, 28, 99]]; //不同级别的行数列数雷数

for (let i = 0; i < btns.length - 1; i++) {
    btns[i].onclick = function () {
        btns[ln].className = '';
        this.className = 'active';
        mine = new Mine(...arr[i])
        mine.init()
        ln = i;
    }
}
btns[0].onclick(); //初始化
btns[3].onclick = function () {//重置
    mine = new Mine(...arr[ln])
    mine.init()
}
