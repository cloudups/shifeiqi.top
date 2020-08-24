---
title: 🧠 JavaScript中的异步编程模型
date: '2020-08-20'
spoiler: 🥕 callback、generator、thunk and promise、async/await.
cta: 'async'
---

### 1. **callback** 产生的问题  

众所周知，使用 **callback** 的编程模型会产生[回调地狱](http://callbackhell.com/)现象: **代码中使用 `})` 层层嵌套，像金字塔一样**。  
如下例所示：

```ts
// 回调接口
interface Callback {
    (ret: Function) => void
}
// 异步操作接口
interface Async {
    (cb: Callback) => void
}

// 初始化异步操作
const async1: Async = ...
const async2: Async = ...
const async3: Async = ...

// 开始异步操作
async1(function(ret1) {
    // ... do something
    async2(function(ret2) {
        // ... do something
        async3(function(ret3) {
            // ... do something
        })
    })
})
```

这样的代码不直观，而且掺杂了业务逻辑之后会很难维护。  
为了解决 **calback hell**，社区提出了很多种规范，有些成为了标准（Promise），有些则逐渐被遗弃（Thunk）。

---

### 2. 我们期望的异步编程模型

我们期望能够避免层层嵌套的 `})` ，以同步书写代码的方式组织异步逻辑：

```ts
// 回调接口
interface Callback {
    (ret: Function) => void
}
// 异步操作接口
interface Async {
    (cb: Callback) => void
}

// 初始化异步操作
const async1: Async = ...
const async2: Async = ...
const async3: Async = ...

// 开始异步操作
const ret1 = async1()
// ... do something
const ret2 = async2() // 等待异步操作 async1 完成再执行
// ... do something
const ret3 = async3() // 等待异步操作 async2 完成再执行
```

这样的代码避免了层层嵌套，极大提高了可维护性，降低开发人员的维护成本，提高开发效率。  
但是 **JavaScript的运行机制** 决定了上述代码的运行结果是错误的，因此我们需要通过其他的手段（Generator...）来取得类似的结果。

---

### 3. Generator + yield（函数对象） 

通过将**异步操作函数对象** 从 `Generator` 中 `yield` 出去，在 `Generator执行器` 中去执行异步操作，从而达到**以同步代码的形式来组织异步逻辑**。 
所以，异步操作的代码组织形式如下：  

```ts
// 回调接口
interface Callback {
    (ret: Function) => void
}
// 异步操作接口
interface Async {
    (cb: Callback) => void
}

// 初始化异步操作函数对象 
const async1: Async = ...
const async2: Async = ...
const async3: Async = ...

// 组织异步逻辑
function* async() {
    const ret1 = yield async1;
    const ret2 = yield async2;
    const ret3 = yield async3;
}
```

**Genertor执行器** 应当如下所示：

```ts
// 定义接口
interface GenExecutor {
    (genFunction: GeneratorFunction) => void
}
interface YieldResult {
    done: boolean
    value: Async
}
// 执行器初始化
const executor: GenExecutor = (genFunction) => {
    const gen: Generator = genFunction();

    const next: Callback = (res) => {
        const ret: YieldResult = gen.next(res);

        if(ret.done) return;
        // 调用异步操作，在回调中进行递归调用
        ret.value((cbRet) => {
            next(cbRet);
        })
    }

    next();
}
```

虽然这种解决方案已经满足了我们的要求：**以同步代码组织异步逻辑**，但是存在以下缺陷：  
1.**yield + 函数对象 [yield async]** 的形式并没有直观的表达出异步操作，更完美的方式应当是 **yield + 函数调用 [yield async()]**。  
2.异步函数无法传参。

---

### 异步模式： Generator + thunk 


1. 什么是 Thunk

2. 定义 Thunk

```ts
interface Thunk {
    (cb: Callback) => void
}
```

3. 如何将异步函数转化为Thunk

```ts
const thunkify = (asyncFunc: AsyncWithParams): Thunk => {

}
```

4. generator + thunk 执行器


5. 异步代码组织形式



### 使用 promise 解决回调地狱问题

### generator + promise 解决回调地狱问题

### async/await 解决回调地狱问题

**参考资料：**  
1. [Haskell-Thunk](https://wiki.haskell.org/Thunk)


### Generator + Promise

### Async & Await