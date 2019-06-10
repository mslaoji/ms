var getCurrentStyle = require('./getstyle.js')
/**
 * 弹性运动
 * @param ele {Object} DOM
 * @param config {Object} 运动设置 
 * config ={
 * 	scale //弹性速度
 *  coe //摩擦系数
 *  attr DOM运动终止条件                }
*/
function elasticMove(ele = null,config = {
    scale:5,
    coe:0.7,
    attrs:{
    },
}){
    // 清除定时器
    clearInterval(ele.timer);
    const attrs = config.attrs;
    const scale = config.scale||5;
    const coe = config.coe||0.7;

    if(coe > 1){
        throw new Error("错误的摩擦因数值");
    }

    let speed = 0;
    return new Promise((resolve)=>{
        ele.timer = setInterval(()=>{
            for(const attr in attrs){
                // 设置目标距离
                let target = Number.parseInt(attrs[attr]);

                // 获取当前的样式
                let currentStyle = (attr === "opacity")?(Number.parseInt(Number.parseFloat(getCurrentStyle(ele,attr))*100)):Number.parseInt(getCurrentStyle(ele,attr));

                // 如果改变的样式是 opacity，target乘以100
                if(attr === "opacity"){
                    target = Number.parseInt(Number.parseFloat(attrs[attr])*100);
                }

                // 获取速度
                speed += (target - currentStyle)/scale;
                speed *= coe;

                if(Math.abs(speed)<1 && Math.abs(target - currentStyle)<1){
                    clearInterval(ele.timer);
                    // 清除定时器后，将元素移动到目标点
                    ele.style[attr] = (attr === "opacity")?target / 100: target + "px";
                    resolve();
                }else{
                    ele.style[attr] = (attr === "opacity")?( currentStyle + speed)/100:(currentStyle + speed) + "px";
                }

            }

        },30);
    });
}


async function start(){
    await elasticMove(ele,{
        coe:0.9,
        attrs:{
            left:"300px",
        }
    });
}