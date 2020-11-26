
;(function(window, undefined) {  

  //生产唯一id
  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xxxxx-xxxxxx-xxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };
  
  //中央事件
  function EventBus () {
      this.events = {};
  }
  
  EventBus.prototype.emit = function(event){
      var arg = [].slice.call(arguments).slice(1);
      for(var fn of this.events[event]){
        fn.call(this, arg);
      }
  
  }
  
  EventBus.prototype.on = function(event, fn){
    if(!this.events[event]){
      this.events[event] = [];
    }
      this.events[event].push(fn);
  }
  
  EventBus.prototype.remove = function(event,  fn){
    var fns = this.events[event]
        if (!fns) {
            return false
        }
        if (!fn) {
            fns && (fns.length = 0)
        } else {
            for (let l = fns.length - 1; l>=0; l--) {
                var _fn = fns[l]
                if ( _fn ===fn) {
                    fns.splice(l, 1)
                }
            }
        }
  }
  
  var eventBus = new EventBus();
  
  
  //获取cookie
  function getCookie(name){
      var strcookie = document.cookie;//获取cookie字符串
      var arrcookie = strcookie.split("; ");//分割
      //遍历匹配
      for ( var i = 0; i < arrcookie.length; i++) {
          var arr = arrcookie[i].split("=");
          if (arr[0] == name){
              return arr[1];
          }
      }
      return "";
  }
  
  //数据重组对象
  function HandleData() {
    
  }
  
  HandleData.prototype.obtain = function( obj ){
    var u = window.navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var appVersion = window.navigator.appVersion;
    var businessUserInfo = JSON.parse(window.sessionStorage.getItem('businessUserInfo')||'{}');

    var events = Object.assign({
        "e1":generateUUID(),//唯一标识
        "e2": +new Date(),//当前时间戳
        "i2":"",
        "i1":"",
        "l1":0,
        "l2":0,
        "m1":appVersion,//设备版本
        "p1":window.location.href,
        "p2":isAndroid? 'andorid' : (isiOS? 'ios' : 'browser'),
        "p3":'',
        "r1":0,
        "s2":"",
        "s3":"",
        "s4":0,
        "t1":"",
        "u2":""
      },obj)
    console.log('%c数据监控===>'+JSON.stringify(events),'color:#fc1;font-size:18px;');
    return events;
  }
  
  
  var handleData = new HandleData();
  
  
  function Listen (obj){
    this.pageHandleFlag = false;
    this.limit = obj.limit || 100; 
  }
  //ajax 监听
  function ajaxEventTrigger(event) {
      var ajaxEvent = new CustomEvent(event, { detail: this });
      window.dispatchEvent(ajaxEvent);
  }
        
  var oldXHR = window.XMLHttpRequest;
  
  //重写ajax请求方便监听
  function newXHR() {
      var realXHR = new oldXHR();
      var send = realXHR.send;
      realXHR.send = function(){
        var arg = [].slice.call(arguments);
        send.apply(realXHR,arg);
        realXHR.body = arg[0];
        realXHR.time = +new Date();//请求体添加开始时间，方便统计请求响应时间
        ajaxEventTrigger.call(realXHR, 'ajaxSend');
      }
      realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxEnd'); }, false);
      return realXHR;
  }
        
  window.XMLHttpRequest = newXHR;
  
  Listen.prototype.init = function() {
    
    this.handleURL();//监听url变化
    this.handleElement();//监听点击元素
    this.handleAjax();//监听ajax
    eventBus.on('track',function(e){
      var link = JSON.parse(window.localStorage.getItem('whole-link') || '[]');
      if(link.length>=(e[1] || 100)){
          link = link.slice(1);
      };
      link.push(e[0]);
      window.localStorage.setItem('whole-link',JSON.stringify(link))
    })
    eventBus.emit('track',handleData.obtain({t1:'visit', p3:window.location.href}),this.limit);
    return this;
  }
  
  Listen.prototype.handleElement = function(){
    const self = this;
    window.document.body.onclick = function (ev) {
    var event = ev || window.ev;
      if(event){
        eventBus.emit('track',handleData.obtain({ s4:0, t1:'click', s2:'ev',s2:event.srcElement._prevClass}),self.limit);
      }  
    }
  }
  
  Listen.prototype._handleUrlChange = function (fnc) {
      var start = +new Date();
      var oUrl = window.location.href;
      var timeout;
      return function(){
        var end = +new Date();
        var nUrl = window.location.href;
        var self = this;
        if(oUrl !== nUrl && !this.pageHandleFlag){
          clearTimeout(timeout)
          this.pageHandleFlag = true;
          timeout = setTimeout(function(){
            var s4 = end - start;
            fnc.call(self, { s4:s4, t1:'leave', p3:oUrl})
            start = end;
            oUrl = nUrl;
          },1)
          
        }
      }
  }
  
  //url
  Listen.prototype.handleURL = function() {
    if( ("onhashchange" in window) && ((typeof window.document.documentMode==="undefined") || window.document.documentMode==8)) {
        window.addEventListener("hashchange", this._handleUrlChange(this._URLpage))
    }
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(this._handleUrlChange(this._URLpage));
    observer.observe(window.document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  
  Listen.prototype._URLpage = function(par){
    this.pageHandleFlag = false;
    eventBus.emit('track',handleData.obtain(par),this.limit);
  }
  
  Listen.prototype.handleAjax = function(){
    const self = this;
    window.addEventListener('ajaxEnd',function(e){
      var a = e.detail,s3;
      var time = +new Date();
      if(a.status === 200){
        var response = JSON.parse(a.response);
        s3 = response.sta || '00'
      }else{
        s3 = a.status;
      }

      eventBus.emit('track', handleData.obtain({t1:'interface', r1:time - a.time, u2:a.responseURL, s3:s3 }),self.limit)
    })
  }
  Listen.prototype.limitfn = function(fn){
      fn && fn()
  }
  window.Listen = Listen;
})(window);


  
