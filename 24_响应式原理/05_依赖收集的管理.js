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

//const depend = new Depend()

// function watchFn(fn) {
//     depend.addDepend(fn)
// }

// watchFn(()=>{
//     const anotherName = objProxy.name
//     console.log(`hello ${objProxy.name}`, "------------")
// })

// watchFn(function(){
//     console.log(objProxy.name, "func2-------")
// })

// function foo(){
//     console.log("普通函数，不需要响应执行")
// }

//获取depend
const dependMap = new WeakMap()

function getDepend(target, key) {
    //根据target对象获取map
    let map = dependMap.get(target)
    if(!map) {
        map = new Map()
        dependMap.set(target, map)
    }
    //在map中根据key获取对应该属性的depend
    let depend = map.get(key)
    if(!depend) {
        depend = new Depend()
        map.set(key, depend)
    }
    return depend
}

//监听对象属性
//vue3 Proxy
//vue2 Object.defineProperty

const objProxy = new Proxy(obj, {
    get: function(target, key, receiver) {
        return Reflect.get(target, key, receiver)
    },
    set: function(target, key, newValue, receiver) {
        Reflect.set(target, key, newValue, receiver)
        const depend = getDepend(target, key)
        console.log(depend.reactiveFns)
        depend.notify()
    }
})





objProxy.name = "李四"
objProxy.name = "罗翔"
objProxy.name = "张三"
