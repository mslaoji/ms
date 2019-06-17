class EventBus{
    constructor(){
        this.events = {}
    }
    on( key, fn, fs){
        var flag = false;
        if(fs){
            flag = true;
        }
        if(!this.events[key]){
            this.events[key] = []
        }
        this.events[key].push({
            handler:fn,
            isKeep:flag
        })
    }
    off(key, fn){
        if(!key){
            this.events = {}
        }
        if(this.events[key] && !fn){
            !fn && delete this.events[key] return;
        }
        let offIndex = -1;
        for(let i = 0; i<this.events[key].length; i++){
            if(this.events[key][i].handler === fn){
                offIndex === i;
            }
        }
        if(offIndex > -1){
            this.events[key].splice(offIndex, 1)
        }
    }
    emit(key, value){
        let args = [].slice.call(arguments, 1);
        for(let i=0; i<this.events[key].length; i++){
            if(this.events[key][i].handler){
                this.events[key][i].handler.apply(this, args);
                if(this.events[key][i].isKeep){
                    this.off(key)
                }
            }
        }
    }
}
