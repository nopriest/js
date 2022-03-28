class Depend {
    constructor(){
        this.reactiveFns = []
    }

    addDepend(fn){
        this.reactiveFns.push(fn)
    }

    notify() {
        this.reactiveFns.forEach(fn => fn())
    }
}

const obj = {
    name: "hsu",
    age: 18
}

const depend = new Depend()

//监听对象属性
//vue3 Proxy
//vue2 Object.defineProperty

const objProxy = new Proxy(obj, {
    get: function(target, key, receiver) {
        return Reflect.get(target, key, receiver)
    },
    set: function(target, key, newValue, receiver) {
        Reflect.set(target, key, newValue, receiver)
        depend.notify()
    }
})

function watchFn(fn) {
    depend.addDepend(fn)
}

watchFn(()=>{
    const anotherName = objProxy.name
    console.log(`hello ${objProxy.name}`, "------------")
})

watchFn(function(){
    console.log(objProxy.name, "func2-------")
})

function foo(){
    console.log("普通函数，不需要响应执行")
}



objProxy.name = "李四"
objProxy.name = "罗翔"
objProxy.name = "张三"
