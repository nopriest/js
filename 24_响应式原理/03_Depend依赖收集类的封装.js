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

function watchFn(fn) {
    depend.addDepend(fn)
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
depend.notify()