let activeReactiveFn = null
/**
 * 对Depend类优化
 * 1.addFunction方法
 * 2.使用Set存放依赖的函数，去重
 */
class Depend {
    constructor(){
        this.reactiveFns = new Set()
    }

    // addFunction(fn){
    //     if(fn){
    //     this.reactiveFns.push(fn)
    //     }
    // }

    //收集依赖
    addActiveReactFun() {
        if(activeReactiveFn){
            this.reactiveFns.add(activeReactiveFn)
        }
    }

    //响应
    notify() {
        console.log(this.reactiveFns)
        this.reactiveFns.forEach(fn => {
            fn()
        })
    }
}

const obj = {
    name: "hsu",
    age: 18
}

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


//封装成函数reactive
function reactive(obj) {
    return new Proxy(obj, {
        get: function(target, key, receiver) {
            const depend = getDepend(target, key)
            depend.addActiveReactFun()
            return Reflect.get(target, key, receiver)
        },
        set: function(target, key, newValue, receiver) {
            Reflect.set(target, key, newValue, receiver)
            const depend = getDepend(target, key)
            depend.notify()
        }
    })
}

//监听对象属性
//vue3 Proxy
//vue2 Object.defineProperty

//const objProxy = reactive(obj)
//新写法一步到位
const objProxy = reactive({
    name: "kodi",
    age: "81"
})


// function watchFn(fn) {
//     depend.addFunction(fn)
// }



//new watchFn
function watchFn(fn) {
    activeReactiveFn = fn
    fn()
    activeReactiveFn = null
}


//测试数据1
// watchFn(()=>{
//     //const anotherName = objProxy.name
//     console.log(`hello ${objProxy.name}`, "------------")
// })

// watchFn(function(){
//     console.log(objProxy.name, "func2-------")
// })



// objProxy.name = "李四"
// //objProxy.name = "罗翔"
// //objProxy.name = "张三"

//测试数据2
watchFn(function() {
    console.log("-----第一个name函数开始------")
    console.log("你好啊, 李银河")
    console.log("Hello World")
    console.log(objProxy.name) // 100行
    console.log("-----第一个name函数结束------")
  })
  
  watchFn(function() {
    console.log(objProxy.name, "demo function -------")
  })
  
  watchFn(function() {
    console.log(objProxy.age, "age 发生变化是需要执行的----1")
  })
  
  watchFn(function() {
    console.log(objProxy.age, "age 发生变化是需要执行的----2")
  })
  
  watchFn(function() {
    console.log(objProxy.name, "新函数")
    console.log(objProxy.name, "新函数")
    console.log(objProxy.age, "新函数")
  })
  
  console.log("------------------------------改变obj的name值")
  
  objProxy.name = "kobe"
  //objProxy.name = "james"
  
  // objProxy.age = 20
  // objProxy.age = 30
  
