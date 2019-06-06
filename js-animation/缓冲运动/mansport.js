function getStyle (obj,attr) { 
			if(obj.currentStyle){ 
				return obj.currentStyle[attr];
			}else{ 
				return getComputedStyle(obj,false)[attr];
			}

		}

	var timer = null;

	function flash(obj,json,func,time) { 

		if(time === undefined){ 
			time = 25;
		}

		clearInterval(obj.timer);

		obj.timer = setInterval(function(){ 

			var flag = true;
			for(var attr in json){ 

				var current = 0;

				if(attr == 'opacity'){ 
					current = parseInt(parseFloat(getStyle(obj,attr))*100);
				}else{ 
					current = parseInt(getStyle(obj,attr));
				}
				var speed = (json[attr]-current)/5;
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
				clearInterval(obj.timer);
				if(func !== undefined){ 
					func();
				}
			}
		},time);
	}

 var leftss=0;
       var speedss=0;
       var timerss = null;
      　　function moves(obj,target){
            clearInterval(timerss);
             timerss=setInterval(function(){
                speedss+=(target-obj.offsetLeft)/15;
                speedss*=0.85;
                leftss+=speedss;
                if (Math.abs(speedss)<1 && Math.abs(leftss-target)<1) {
                    clearInterval(timerss);
                    obj.style.left=target+'px';
                }else{
                    obj.style.left=leftss+'px';                   
                }

            },30);
        }

