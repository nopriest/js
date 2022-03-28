const { forOwn } = require("lodash")

const obj = {
    name: "hsu",
    age: 18
}

let reactiveFns = []

function watchFn(fn) {
    reactiveFns.push(fn)
}

watchFn(()=>{
    const anotherName = obj.name
    console.log(`hello ${obj.name}`)
})

watchFn(function(){
    console.log(obj.name, "func2-------")
})

function foo(){
    console.log("普通函数，不需要响应执行")
}

obj.name = "李银河"
reactiveFns.forEach(fn=>fn())