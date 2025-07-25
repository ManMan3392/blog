# react中常用的hook
## useState
React 的函数组件是纯函数，意味着每次执行都是“重新开始”。但我们需要在这个“纯函数”中记住某些值 —— 比如用户点了几次按钮 —— 这就需要 状态（state）。
useState允许我们在组件的顶层调用,向组件添加一个 状态变量。
```jsx
const [state, setState] = useState(initialState)
```
React 在内部为每个组件维护一个**“hooks 状态链表”**（或者数组）
```jsx
Component:
- hook1 (useState count = 0)
- hook2 (useEffect ...)
- hook3 (useState name = 'Bob')

```
每调用一次 useState，就往里面存一个状态。React 依靠 “调用顺序不变” 来定位每个 useState 对应的状态。下次更新组件时，React 重新执行函数，重新调用 useState，但会复用之前保存的 hook 状态。当我们调用setState时，React所作的操作有：
1. **触发更新请求**:
   React 会创建一个**更新对象（update）**,这个**update**会被加入到当前组件对应Fiber节点的**updateQueue（更新队列）**中。然后 React 会调度一次更新，准备构建一棵新的 Fiber 树
2. **构建新 Fiber 树（render phase）**:
   React 开始从根组件向下遍历，构建新的 Fiber 节点（其实是生成新的工作树）。建到使用了 useState 的函数组件时调用 useState 的内部实现,这时候 React 会从 updateQueue 中取出最新的值,然后用这个值生成新的 hook 对象，挂到新 Fiber 的 hooks 链表中。
3. **提交（commit phase）**:
   当整棵新 Fiber 树构建完毕后,React 会比较旧 Fiber 树和新 Fiber 树的差异,然后执行“提交阶段”：更新 DOM、触发副作用（如 useEffect）
## useEffect
用于在组件渲染后执行副作用操作,不会阻塞渲染过程，而是延后执行。useEffect 本质上是创建一个 effect 对象，挂在 Fiber 的 effect 链表上。
```jsx
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 可选：清除逻辑（如取消订阅）
  };
}, [deps]);

```
1. 在render阶段：
   会创建一个 effect 对象，设置 flag，加入 fiber.updateQueue.lastEffect 链表中，**这一步只是注册副作用，并没有执行。**
2. commit执行阶段:
   先执行上一个副作用的 清理函数 destroy,再执行副作用的 create 函数。**React 将 useEffect 放到浏览器空闲时间或 Promise.resolve().then(...) 之后执行，确保它不阻塞页面渲染。**
## useCallback和useMemo(性能优化)
### 使用场景
两个函数都有性能优化的作用，但我的理解感觉主要适用场景为优化子组件渲染。
#### useCallback使用场景：
useCallback在依赖未变化的情况下使用上一次的函数，即**给子组件传递的函数不变化**，父组件其他地方的渲染不会引起子组件的重新渲染。
#### useMemo使用场景：
useMemo主要是对函数返回值的优化，在依赖未改变的情况下使用之前的返回值，即**给子组件传递某个函数返回值时**或者**用useMemo包裹一个对象**，在父组件其他地方改变时不引起子组件的重新渲染。
### 基本使用介绍：
#### useCallback:
```jsx 
import React, { memo, useCallback, useRef, useState } from 'react'
const UseCallbacksonComponent = memo((props) => {
    const { changeNum } = props
    return (
        <div>
            <button onClick={e => changeNum()}>sonComponent+1</button>
        </div>
    )
})
const UseCallback = memo(() => {
    const [num, setnum] = useState(0)
    const countRef = useRef()
    countRef.current = num
    const changeNum = useCallback(() => setnum(num + 1), [num])
    return (
        <div>
            <h2>callback数据展示{num}</h2>
            <button onClick={e => changeNum()}>+1</button>
            <UseCallbacksonComponent changeNum={changeNum} />
        </div>
    )
})

export default UseCallback
```
只有在num改变时才会传入新定义的函数，渲染子组件。
##### 闭包陷阱：
useCallback在此处其实就构成了一个闭包，如果不传入num的话，相当于一直使用的第一次定义的函数，该函数‘记住’的num值为第一次的num值，所以页面num一直不会改变
##### 进一步优化：
以上案例里虽然做到了基本的父组件其他地方改变不引起子组件重新渲染，但其实当点击父组件按钮改变num时仍会引起使用新函数，导致子组件随之重新渲染，callback的优化目的是尽量不重新构建函数，所以我们可以使用useRef，由于是引用数据，改变num数值时地址未改变，所以不需要设置依赖，函数‘记住’的值是useref的地址，打破了闭包陷阱，同时由于未设置依赖，即使num改变函数也不需要重新构建，对于子组件，由于函数的参数props值发生改变，会引起子组件的重新渲染，最后得到正确渲染的结果。
```jsx
const UseCallback = memo(() => {
    const [num, setnum] = useState(0)
    const countRef = useRef()
    countRef.current = num
})

export default UseCallback 
```

#### useMemo:
```jsx
import React, { memo, useCallback } from 'react'
import { useMemo, useState } from 'react'


const HelloWorld = memo(function(props) {
  console.log("HelloWorld被渲染~")
  return <h2>Hello World</h2>
})


function calcNumTotal(num) {
   console.log("calcNumTotal的计算过程被调用~")
  let total = 0
  for (let i = 1; i <= num; i++) {
    total += i
  }
  return total
}

const App = memo(() => {
    const [count, setCount] = useState(0)

  const result = useMemo(() => {
    return calcNumTotal(50)
  }, [])

  return (
    <div>
      <h2>计算结果: {result}</h2>
      <h2>计数器: {count}</h2>
      <button onClick={e => setCount(count+1)}>+1</button>

      <HelloWorld result={result}/>
    </div>
  )
})

export default App
```
useMemo记住result的值，所以就算点击按钮导致父组件重新渲染，传入子函数的值没变，故不会引起子函数的重新渲染
```jsx
import React, { memo, useCallback } from 'react'
import { useMemo, useState } from 'react'


const HelloWorld = memo(function(props) {
  console.log("HelloWorld被渲染~")
  return <h2>Hello World</h2>
})

const App = memo(() => {
  const [count, setCount] = useState(0)

  const info = useMemo(() => ({name: "why", age: 18}), [])

  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={e => setCount(count+1)}>+1</button>

      <HelloWorld info={info} />
    </div>
  )
})

export default App
```
usseMemo的第二种用法，包裹对象，因为在父组件重新渲染时会重新生成对象，其地址改变，只用memo包裹函数的话只进行浅层比较发现对象地址改变会引起子组件的重新渲染,使用useMemo包裹在依赖未改变的情况下仍返回原对象，不引起子组件重新渲染。
#### useCallback和useMemo联系：
```jsx
const increment = useCallback(fn, [])
const increment2 = useMemo(() => fn, [])
```
二者等价
#### 注：
两者都没有阻止父组件重新渲染时创建新的函数，useCallback只是选择使用的之前的函数，useMemo是使用之前的函数返回的值，但其实都在父组件渲染时生成了新函数，优化的点并不在这。