/**
函数防抖
@param func {Function} 回调函数
@param delay {Number} 时间 多久出发一次
*/

function debounce(func, delay) {
    let timeout
    return function(e) {
        clearTimeout(timeout)
        let args = arguments
        timeout = setTimeout(() => {
          func.apply(this, args)
        },delay)
    }
}


/**
函数防抖
@param func {Function} 回调函数
@param delay {Number} 时间 多久出发一次
*/

function throttle(func, delay) {
 var timeout
 var start = new Date;
 var threshhold = threshhold || 160
 return function () {

 var context = this, args = arguments, curr = new Date() - 0
 
 clearTimeout(timeout)
 if(curr - start >= threshhold){ 
     fn.apply(context, args)
     start = curr
 }else{
     timeout = setTimeout(function(){
        fn.apply(context, args) 
     }, threshhold);
    }
  }
}
