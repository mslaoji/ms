var getCurrentStyle = require('./getstyle.js')

/**
 * 缓冲运动
 * @param obj {Object} DOM
 * @param json {Object} DOM属性设置
 * @param func {Function} 回调函数
 * @param time {Number} 时间
*/
function flashT(obj,json,func,time) { 

	if(time === undefined){ 
		time = 25;
	}

	clearInterval(obj.timerT);

	obj.timerT = setInterval(function(){ 

		var flag = true;
		for(var attr in json){ 

			var current = 0;

			if(attr == 'opacity'){ 
				current = parseInt(parseFloat(getCurrentStyle(obj,attr))*100);
			}else{ 
				current = parseInt(getCurrentStyle(obj,attr));
			}
			var speed = (json[attr]-current);
			speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);

			if(current!=json[attr]){ 
				flag = false;
			}

			if(attr == 'opacity'){ 
				obj.style.filter = 'alpha(opacity:'+(current+speed)+')';
				obj.style.opacity = (current+speed)/100;
			}else{ 
				obj.style[attr] = current+speed+'px';
			}

		}

		if(flag){ 
			clearInterval(obj.timerT);
			if(func !== undefined){ 
				func();
			}
		}
	},time);
}