/**
 * js AOP编程应用
 * @param Function {Function}
 */
Function.prototype.before = function(before){
  var self = this;
  return function(){
    before.apply(self, arguments);
    return self.apply(this, arguments);
  }
}

Function.prototype.after = function(){
  var self = this;
  return function(){
    var fn = self.apply(this, arguments);
    after.apply(self, arguments);
    return fn;
  }
}

var fn = function(){
  alert('执行任务')
}
fn.before(function(){
  alert('任务执行前调用')
}).after(function(){
  alert('任务执行后调用')
})
