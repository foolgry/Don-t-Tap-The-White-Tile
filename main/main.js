/*
* @Author: _foolgry
* @Date:   2016-03-20 02:01:59
* @Last Modified by:   _foolgry
* @Last Modified time: 2016-03-20 02:02:27
*/

'use strict';
//全局变量
var MYAPP = {
    speed: 1,  //速度
    timer: null, //定时器
    scoreNum: 0  //分数
}
// 初始化
init();
/*
 * 初始化函数，创建初始界面，并给白块黑块通过事件委托添加点击事件
 */
function init() {
    var con = $("container"),
        start = $("start");
    //用户点击后开始
    addEvent(start, "click", function() {
        this.style.display = 'none';
        for( var i=0; i<4; i++) {
        createRow();
        }
        startMove();
    });
    //给容器添加点击事件，事件委托
    addEvent(con, 'click', function(ev) {
        var ev = getEvent(ev);
        dealClick(ev);
    });
}

/*
 * 通过记分时添加在父节点上的一个属性和行数，判断游戏是否结束
 */
function judge() {
    var con = $("container"),
        rows = con.lastChild,
        childNum = con.children.length;
    if((childNum == 5) && (rows.pass !== 1)) {
        return true;
    }
}

/*
 *记分函数，做+1操作，并且在每10分后做加速动作
 */
function score() {
    // console.log(MYAPP.scoreNum)
    $("score").innerHTML = ++MYAPP.scoreNum;
    if(MYAPP.scoreNum % 10 == 0) {
        speedUp();
    }
}
/*
 *处理点击事件，点击黑色则记分并且将其变白
 */
function dealClick(ev) {
    var target = getTarget(ev);
    // console.log(target.className)
    if(target.className.indexOf('black') != -1) {
        // console.log($("container").children.length)
        score();
        target.parentNode.pass = 1;
        target.className = 'cell';
    }
}

/*
 * 获取事件的target对象
 */
function getTarget(ev) {
    var ev = getEvent(ev);
    return ev.target || ev.srcElement;
}
/*
 *获取事件对象
 */
function getEvent(ev) {
    return ev || window.event;
}
/*
 *删除溢出的行
 */
function delRow() {
    var con = $("container");
    if(con.children.length == 6) {
        con.removeChild(con.lastChild);
    }
}
/*
 *添加事件函数
 */
function addEvent(obj, evt, fn) {
    if(obj.addEventListener) {
        obj.addEventListener(evt, fn, null);
    }else if(obj.attachEvent){
        obj.attachEvent.apply(obj, 'on' + evt, fn);
    }else {
        obj['on' + evt] = fn;
    }
}
/*
 * 开始运动函数
 */
function startMove() {
    MYAPP.timer = setInterval(function() {
        move();
    }, 30);
}
/*
 *移动白块函数
 */
function move() {
    var con = $("container"),
        // oScore = $("score"),
        rowCnt = con.children.length,
        top = con.offsetTop;
    /*
     *处理加速后速度不能被整出的情况
     */
    if(top + MYAPP.speed > 0) {
        top = 0;
    } else {
        top += MYAPP.speed;
    }

    con.style.top = top + MYAPP.speed + 'px' ;

    /*
     * 分为两种情况进行检测
     */
    if(top == 0) {
        createRow();
        con.style.top = '-100px' ;
        delRow();
    }
    if(top == MYAPP.speed - 100) {
        if(judge()) {
            fail();
        }
    }
}

/*
 *游戏结束后的方法
 */
function fail() {
    alert('lose');
    clearInterval(MYAPP.timer);
}
/*
 *加速函数
 */
function speedUp() {
    MYAPP.speed += 1;
}

/*
 *产生随机数组，模拟随机黑块
 */
function crateArr() {
    var arr = ['cell','cell','cell','cell'],
        i = Math.floor(Math.random()*4);//产生0-3的随机数
        // console.log(i)
    arr[i] = "cell black";
    return arr;
}

/*
 *创建一行4列div并插入container中
 */
function createRow() {
    var row = createDiv("row"),
        con = $("container"),
        classArr = crateArr();
    for( var i=0; i<4; i++) {
        var div = createDiv(classArr[i]);
        row.appendChild(div);
    }
    if(con.children) {
        con.insertBefore(row, con.firstChild);
    }else {
        con.appendChild(row);
    }
}

/*
 *创建div并且设置类名
 */
function createDiv(claName) {
    var div = document.createElement("div");
    div.className = claName;
    return div;
}
/*
 *id 选择器
 */
function $(id) {
    return document.getElementById(id);
}
