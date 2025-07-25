# react组件通信方式
## 组件嵌套
在复杂的项目中，组件间会出现复杂的嵌套，由此产生了组件通信的问题。
## 父子通信
### 父传子
父组件在展示子组件，可能会传递一些数据给子组件：
1. 父组件通过 属性=值 的形式来传递给子组件数据。
2. 子组件通过 props 参数获取父组件传递过来的数据。
   
例如：
**父组件**
```jsx
import React, { memo, useState } from 'react'
const Home = memo(() => {
  const { name,setName } = useState('zmy')
  return <RoomItem name={name}/>
})

export default Home
```
**子组件**
```jsx
import React, { memo } from 'react'

const RoomItem = memo((props) => {
    const { name } = props
    return <div>{name}</div>
})

export default RoomItem
```
### 子传父
1. 让父组件给子组件传递一个回调函数。
2. 在子组件中调用这个函数。
```jsx
import React, { useState } from 'react'
function ParentComponent() {
  const [message, setMessage] = useState('')
  const handleMessage = (message) => {
    setMessage(message)
  };

  return (
    <div className="container">
      <p>子组件传递的消息: {message}</p>
      {/* 将回调函数作为props传递给子组件 */}
      <ChildComponent onSendMessage={handleMessage} />
    </div>
  );
}

// 子组件
function ChildComponent({ onSendMessage }) {

  // 当按钮被点击时，调用父组件传递的回调函数
  const sendMessage = () => {
      onSendMessage('zmy')
    }
  
  return (
    <div className="child-component">
      <h3>子组件</h3>
      <button onClick={sendMessage}>发送给父组件</button>
    </div>
  )
}

export default ParentComponent;    
```
### 插槽
让使用者可以决定某一块区域到底存放什么内容
1. **组件的children子元素**：直接在标签之间插入子元素，在子组件中通过props.children获取（传入一个元素时为单个元素，多个元素时为数组）。
2. **props属性传递React元素**：（推荐）
   在父组件中把元素直接作为一个参数传入
   ```jsx
    import React, { memo, useContext } from 'react'
    import Children from './Pages/Children'

    const App = memo(() => {
        return (
            <div>
                <Children 
                leftslot={<h2>左边</h2>}
                centerslot={<button>中间</button>}
                rightslot={<h2>右边</h2>}
                />
            </div>
        )
    })
   ```
   在子组件中通过取参数的方法拿到元素
   ```jsx
    function Children(props) {
    const {leftslot,centerslot,rightslot} = props
    return (
        <div className="child-component">
        <div className='left'>{leftslot}</div>
        <div className='center'>{centerslot}</div>
        <div className='right'>{rightslot}</div>
        </div>
    )
    }

    export default Children;   
   ```
## 非父子通信
一些数据需要在多个组件中进行共享，如果我们在顶层的App中定义这些信息，之后一层层传递下去，那么对于一些中间层不需要数据的组件来说，是一种冗余的操作。
### context
**Context**提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递**props**。**Context** 设计目的是为了共享那些对于一个组件树而言是**全局**的数据。
1. 创建一个需要共享的Context对象：React.createContext 
```jsx
const myContext = React.createContext(defaultValue)
```
1. 如果一个组件订阅了Context，那么这个组件会从离自身最近的那个匹配的 Provider 中读取到当前的context值。
2. 组件在顶层查找过程中没有找到对应的Provider，那么就使用默认值defaultValue
3. 每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。
4. Provider 接收一个 value 属性，传递给消费组件，多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。
5. 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。
6. React 组件可以通过Context.Consumer订阅到 context 变更。

**创建上下文**
```jsx
//react/react初体验/01react/src/context/index.js
import { createContext } from "react";
const UserContext = createContext()
const ThemeContext = createContext()

export {
    UserContext,
    ThemeContext
}
```
**使用Provider React 组件包裹App组件，这样所有子组件都可以拿到数据。**
```jsx
//react/react初体验/01react/src/index.js
import { UserContext, ThemeContext } from './context';

const App = () => {
  return (
     <UserContext.Provider value={{ name: 'zmy', age: 18 }}>
            <ThemeContext.Provider value={{ color: 'red', size: 30 }}>
                        <App />
            </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

export default App;  
```
**在App中引入子组件（使用数据的组件）**
```jsx
// react/react初体验/01react/src/App.jsx
import React, { memo, useContext } from 'react'
import UseContext from './Pages/UseContext'

const App = memo(() => {
    return (
        <div>
            <UseContext/>
        </div>
    )
})
```
**使用的组件（使用useContext函数即可拿到数据）**
```jsx
//react/react初体验/01react/src/Pages/UseContext.jsx
import React, { memo, useContext } from 'react'
import { ThemeContext, UserContext } from '../context'

const UseContext = memo(() => {
    const user = useContext(UserContext)
    const theme = useContext(ThemeContext)

    return (
        <div>
            <div className="usertab">
                <h2>{user.name}</h2>
                <h2>{user.age}</h2>
            </div>
            <div className="theme"
                style={{ color: theme.color, fontSize: theme.size }}
            >Theme</div>
        </div>
    )
})

export default UseContext
```
### 事件总线
事件总线（Event Bus）是一种设计模式和实现机制，用于在应用程序中实现组件间的松散耦合通信。它基于发布 - 订阅（Publish-Subscribe）模式，允许不同组件之间通过一个中央事件系统进行消息传递，而不需要直接依赖彼此。
使用的话可以引入一些库。
```jsx
class EventBus {
  constructor() {
    this.events = {}; // 存储事件及其回调函数的映射
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // 发布事件
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }

  // 取消订阅
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        cb => cb !== callback
      );
    }
  }
}

// 创建单例实例
const eventBus = new EventBus();
export default eventBus;
```
**使用**
```jsx
// 组件 A（发布者）
import eventBus from './eventBus';
eventBus.emit('message-sent', 'Hello from Component A');

// 组件 B（订阅者）
import eventBus from './eventBus';
eventBus.on('message-sent', (message) => {
  console.log('Received:', message);
});
```
### redux
Redux就是一个帮助我们管理State的容器：Redux是JavaScript的状态容器，提供了可预测的状态管理
具体使用如下：
```jsx
import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { changeNum } from '../store/features/counter'
import { shallowEqual } from 'react-redux'

const Useselector = memo(() => {
    const { count } = useSelector((state) => ({
        count: state.counter.count
    }), shallowEqual)
    const dispatch = useDispatch()
    const changeNameHandle = (num) => {
        num = num - 0
        dispatch(changeNum(num))
    }
    return (
        <div>
            <h2>useselector数据展示：{count}</h2>
            <button onClick={e => changeNameHandle(1)}>+1</button>
            <button onClick={e => changeNameHandle(-1)}>-1</button>

            <button onClick={e => changeNameHandle(10)}>+10</button>

            <button onClick={e => changeNameHandle(-10)}>-10</button>

        </div>
    )
})

export default Useselector
```
[原生redux配置](https://github.com/ManMan3392/redrockhomework/tree/main/react/react%E5%88%9D%E4%BD%93%E9%AA%8C/01react/src/redux )
[使用Redux Toolkit配置](https://github.com/ManMan3392/redrockhomework/commit/bcad413115fd05f926e953fd93ae03878a13d287#diff-58ba067753f0ad65a7eb7afda2f0bd6711740e49d419b2d920b6a80b34f141ba)
### ref
父组件使用 ref 获取子组件的实例，可以调用子组件中通过 useImperativeHandle 暴露的方法。
1. 子组件使用 forwardRef 接收 ref。
2. 子组件用 useImperativeHandle 暴露希望父组件调用的函数。
3. 父组件通过 useRef 创建 ref，并传给子组件。
4. 父组件可以通过这个 ref 调用子组件中定义的方法。

**子组件**
```jsx
import React, { useImperativeHandle, forwardRef } from 'react';

const Child = forwardRef((props, ref) => {
  const showAlert = () => {
    alert('子组件的方法被调用了！');
  };

  useImperativeHandle(ref, () => ({
    showAlert, 
  }));

  return <div>我是子组件</div>;
});

export default Child;

```
**父组件**
```jsx
import React, { useRef } from 'react';
import Child from './Child';

const Parent = () => {
  const childRef = useRef();

  const handleClick = () => {
    childRef.current.showAlert(); // 调用子组件方法
  };

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={handleClick}>调用子组件方法</button>V
    </div>
  );
};

export default Parent;

```
### 路由参数
父子组件通信中使用路由参数可以携带简单数据，不过一般不使用。
[小例子](https://github.com/ManMan3392/redrockhomework/commit/95537d74041ab369d4a01e037fe7d6c38fed0b3c#diff-4f0fca01d900ebdc989cfa3ff5ed1d2bd41b1c4865c49733391922c9617711f0)