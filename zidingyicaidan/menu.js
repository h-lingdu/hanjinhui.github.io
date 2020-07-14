class Init{
    static createDom(type,style,parent=document.body){
        let ele=document.createElement(type);
        for(let prop in style){
            ele.style[prop]=style[prop]
        }
        parent.appendChild(ele);
        return ele;
    }
    static eleDrag(ele){
        ele.style.position="absolute";
        ele.addEventListener("mousedown",Init.mousehandler);
    }
    static removeDrag(ele){
      ele.style.display="none";
      ele.removeEventListener("mousedown",Init.mousehandler);
    }
    static eleRemove(ele){
        ele.removeEventListener("mousedown",Init.mousehandler)
    }
    static mousehandler(e){
        if(e.type==="mousedown"){
            e.currentTarget.point={x:e.offsetX,y:e.offsetY};
            document.ele=e.currentTarget;
            document.addEventListener("mousemove",Init.mousehandler);
            document.addEventListener("mouseup",Init.mousehandler);
            document.addEventListener("mouseleave",Init.mousehandler);
            e.currentTarget.dispatchEvent(new Event(Init.MOUSE_DOWN_EVENT));
        }else if(e.type==="mousemove"){
            document.ele.style.left =e.x - document.ele.point.x+"px";
            document.ele.style.top =e.y -  document.ele.point.y+"px";
            document.ele.dispatchEvent(new Event(Init.MOUSE_MOVE_EVENT));
            //开始移动后鼠标在document上移动后，
        }else if(e.type==="mouseup"){
            document.removeEventListener("mousedown",Init.mousehandler);
            document.removeEventListener("mousemove",Init.mousehandler);
            document.ele.dispatchEvent(new Event(Init.MOUSE_UP_EVENT));
        }
    }
    static randomColor(alpha=1){
        if(alpha<0 || alpha>1) alpha=1;
        // let col="#";
        // for(let i=0;i<3;i++){
        //     col+=parseInt(Math.random()*256).toString(16).padStart(2,"0");
        // }
        // return col  不含透明度写法
        let rgb=[];
        for(let i=0;i<3;i++){
            rgb.push(parseInt(Math.random()*256))
        }
        return `rgba(${rgb.join()},${alpha})`
    }
    static randomNum(a,b){
        return Math.random()*(a-b)+b
    }
    static get MOUSE_DOWN_EVENT(){
      return "mouse_down_event"
    }
    static get MOUSE_MOVE_EVENT(){
      return "mouse_move_event"
    }
    static get MOUSE_UP_EVENT(){
      return "mouse_up_event"
    }
}