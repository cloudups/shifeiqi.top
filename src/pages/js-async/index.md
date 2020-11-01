---
title: 🧠 JavaScript中的异步编程模型
date: '2020-08-20'
spoiler: 🥕 callback、generator、thunk and promise、async/await.
cta: 'async'
---

> 请注意：本文中所有代码均为伪码，并不能实际运行！

### 1. **callback** 产生的问题  

众所周知，使用 **callback** 的编程模型会产生[回调地狱](http://callbackhell.com/)现象: **代码中使用 `})` 层层嵌套，像金字塔一样**。  
如下例所示：

```ts
// 回调接口
interface Callback {
    (ret: Function) : void
}
// 异步操作接口
interface Async {
    (cb: Callback) : void
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
    (ret: Function) : void
}
// 异步操作接口
interface Async {
    (cb: Callback) : void
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

### 3. Generator + yield（函数对象） ：Demo方案

通过将**异步操作函数对象** 从 `Generator` 中 `yield` 出去，在 `Generator执行器` 中去执行异步操作，从而达到**以同步代码的形式来组织异步逻辑**。 
所以，异步操作的代码组织形式如下：  

```ts
// 回调接口
interface Callback {
    (ret: Function) : void
}
// 异步操作接口
interface Async {
    (cb: Callback) : void
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

这种方案只能当作玩具 (lll￢ω￢)。  

---

### 4. Generator + thunk : 古老的异步解决方案 

**Generator + Thunk** 的组合方案现在很少有人在用，但是其中蕴含的思想确实值得借鉴的：**通过`延迟执行异步操作`，来达到以`同步代码组织异步逻辑`的目的**。

- **什么是 Thunk ？**  

**Thunk** 是函数式编程中的一个概念，具体见: [Haskell Thunk](https://wiki.haskell.org/Thunk)，在 JavaScript 中只需要将 **Thunk** 理解为符合以下类型约束的函数对象即可：  

```ts
interface Callback {
    (res: any) : void
}

// Thunk 类型
interface Thunk {
    (cb: Callback) : void
}
```

- **Generator + Thunk 组合的前提**  

**Generator + Thunk** 方案可以使用的前提是：**异步操作函数**需要返回一个接受回调函数的**Thunk函数对象**。即我们的**异步操作函数**应当符合以下接口类型约束：  

```ts
interface ThunkAsync {
    (...params: any[]): Thunk
}
```

而我们的异步函数的类型一般都是以下类型的：  

```ts
interface Async {
    (...preParams: any[], cb: Callback) : void
}
```

所以我们需要一个`高阶函数 thunkify`，实现转换的效果：`ThunkAsync = thunkify(Async)`。以下是一个简单的实现：  

```ts
function thunkify(func: Async): Function {
    
    return function() {
        const args = [];
        for(let i = 0; i < arguments.length; i++) 
            args[i] = arguments[i];
        
        const thunk: Thunk = (cb) => {
            func(...args, cb);
        }

        return thunk;
    }
}
```

- **Generator + Thunk 实施**  

通过此方案我们写出的代码应当如下：  

```ts
//初始化异步操作
const async1: ThunkAsync = ...
const async2: ThunkAsync = ...
const async3: ThunkAsync = ...

function* gen() {
    const ret1 = yield async1(param1, param2...);
    const ret2 = yield async2(param1, param2...);
    const ret3 = yield async3(param1, param2...);
}
```

Generator 执行器代码如下：  

```ts
const executor: GenExecutor = (genFunction) => {
    const gen: Generator = genFunction();

    const next: Callback = (res) => {
        const ret: YieldResult = gen.next(res);

        if(ret.done) return;
        // 调用异步操作，在回调中进行递归调用
        const thunk = ret.value;
        thunk((cbRet) => {
            next(cbRet);
        })
    }

    next();
}
```

### Generator + Promise : ES6 中的完美方案  

- 使用形式  

```ts
interface PromiseAsync {
    (...params) : Promise
}

//初始化异步操作
const async1: PromiseAsync = ...
const async2: PromiseAsync = ...
const async3: PromiseAsync = ...

function* gen() {
    const ret1 = yield async1(param1, param2...);
    const ret2 = yield async2(param1, param2...);
    const ret3 = yield async3(param1, param2...);
}
```
  
- Generator 执行器实现

```ts
const executor: GenExecutor = (genFunction) => {
    const gen: Generator = genFunction();

    const next: Callback = (res) => {
        const ret: YieldResult = gen.next(res);

        if(ret.done) return;
        // 调用异步操作，在回调中进行递归调用
        const promise = ret.value;
        promise.then((value) => {
            next(value);
        })；
    }

    next();
}
```

### async/await 

- 使用形式  

```ts
interface PromiseAsync {
    (...params) : Promise
}

// 初始化异步操作
const async1: PromiseAsync = ...
const async2: PromiseAsync = ...
const async3: PromiseAsync = ...

function async async() {
    const ret1 = await async1(param1, param2...);
    const ret2 = await async2(param1, param2...);
    const ret3 = await async3(param1, param2...);
}
```