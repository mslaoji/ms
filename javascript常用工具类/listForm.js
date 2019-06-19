/*
* 表单序列化  new $submit(dom).on((e)=>{ console.log(e)})  
*/



class $submit {
        constructor(ele){
            this.submit = {};
            this.dom = document.getElementById(ele);
        }
        on(fn){
            const form = [...this.dom.elements], self = this;
            const hasName = (name, ele)=>{
                return ele.getAttribute('name') || false;
            }
            const actions = (() =>{
                const fnA = (element) =>{
                    const hasname = hasName('name', element);
                    if(hasname){
                        if(!self.submit.hasOwnProperty(hasname)){
                            self.submit[hasname] = '';
                        }
                        if((element.type === 'radio' && element.checked) || element.type !== 'radio'){
                            self.submit[hasname] = element.value;
                        }
                    }
                };
                const fnB = (element)=>{
                    const hasname = hasName('name', element);
                    if(hasname && element.options){
                        self.submit[hasname] = [...element.options].filter(item=>item.selected).map(v=>v.value)
                    }

                };
                const fnC = (element)=>{
                    const hasname = hasName('name', element);
                    if(hasname){
                        if(!self.submit[hasname]){
                            self.submit[hasname] = []
                        }else{
                            element.checked ? self.submit[hasname].push(element.getAttribute('value') || '') : console.log;
                        }
                    }
                };
                return new Map([
                    [/(radio|submit|button|text|pass|password|textarea)/,fnA],
                    [/select-one|select-multiple/,fnB],
                    [/checkbox/,fnC]
                ])
            })();
            form.forEach(item=>{
                [...actions].filter(([key,value])=> key.test(item.type)).forEach(([value,val])=> val(item))
            })
            fn && fn(self.submit)
        }
    }
