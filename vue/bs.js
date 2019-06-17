Class EventBus{
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
            handler:cb,
            isKeep:flag
        })
    }
    off(key, fn){
        if(this.events[key]){
            !cb && delete this.events[key]
        }
        let offIndex = -1;
        for(let i = 0; i<this.events[key].length; i++){
            if(this.events[key][i].handler === cb){
                offIndex === i;
            }
        }
        if(offIndex > -1){
            this.events[key].splice(offIndex, 1)
        }
    }
    emit(key, value){
        let args = [].slice.call(arguments, 1);
        const self = this;
        for(let i=0; i<this.events[key].length; i++){
            if(this.events[key][i].handler){
                this.events[key][i].handler.apply(this, args);
                if(!this.events[key][i].isKeep){
                    self.off(key, this.events[key][i].handler)
                }
            }
        }
    }
}