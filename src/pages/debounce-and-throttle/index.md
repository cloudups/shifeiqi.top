---
title: 🔎 防抖与节流
date: '2020-08-19'
spoiler:  👉 防抖与节流的原理分析、使用场景探索 👈
cta: 'float'
---

### 🤔 一个卡顿的小例子

这个例子模拟这样一种业务场景：**根据输入框中的内容去刷新列表内容**。  
尝试在输入框中输入内容，你会发现页面交互非常 **卡顿**。

<iframe height="527" style="width: 100%;" scrolling="no" title="debounce-raw" src="https://codepen.io/cloudups/embed/poyNwZB?height=527&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/cloudups/pen/poyNwZB'>debounce-raw</a> by master.shi
  (<a href='https://codepen.io/cloudups'>@cloudups</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>  

- **这个例子具体的操作：**  
  1.为搜索框设置输入监听事件。  
  2.监听事件每次触发都会请求数据，重新刷新DOM。

---

### 🤚 为什么会卡顿？

因为频繁的请求数据，操作DOM，使资源被占用过度，浏览器响应用户输入就会变的**迟钝**，从而产生**卡顿**的现象。  
- 诸如此类还有如下操作：  
  1.监听浏览器窗口缩放，并做一些消耗资源的计算。  
  2.实时监听鼠标位置，刷新拖拽组件的位置。  
  3.根据用户输入刷新内容列表。  
  4....  

---

### 🤜 如何解决卡顿？

解决**卡顿**常用的做法是**通过降低监听事件的响应频率**，减少资源的使用。  
目前常用的方案有：**防抖**、**节流**。

---

### 👉 例一：通过 防抖处理 来降低卡顿

防抖（debounce）的思想是：存在固定值**wait**，当响应函数被触发时延迟 **wait** 毫秒执行响应函数，如果在这段时间内响应函数被再次触发，则重置延迟执行时间为 **wait**。

<iframe height="486" style="width: 100%;" scrolling="no" title="debounce-debounce" src="https://codepen.io/cloudups/embed/ExKNvgZ?height=486&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/cloudups/pen/ExKNvgZ'>debounce-debounce</a> by master.shi
  (<a href='https://codepen.io/cloudups'>@cloudups</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

通过上例很明显可以发现防抖处理的一个缺陷：在用户输入的时候列表内容不会被刷新。

---

### 👉 例二：通过 节流处理 来降低卡顿

节流（throttle）的思想是：存在固定值**wait**，当响应函数被触发时延迟 **wait** 毫秒执行响应函数。在这段时间内不再响应触发事件。

<iframe height="467" style="width: 100%;" scrolling="no" title="debounce-throttle" src="https://codepen.io/cloudups/embed/dyMNYrN?height=467&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/cloudups/pen/dyMNYrN'>debounce-throttle</a> by master.shi
  (<a href='https://codepen.io/cloudups'>@cloudups</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

节流看似解决了**卡顿**的问题，其实不然。如果出现了以下情况，**卡顿**现象可能还会存在：  
1.**wait** 取值不恰当。  
2.设备的性能较差。  
3.需要的资源较多（需要刷新很多的DOM等）。  

---

### 👉 例三：通过框架方案解决。

参考：[React Concurrent 模式介绍](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html)