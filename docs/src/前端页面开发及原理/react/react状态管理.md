# react状态管理
## 本地状态管理
### useState
useState允许我们在组件的顶层调用,向组件添加一个 状态变量。
```jsx
const [state, setState] = useState(initialState)
```
**（详见react常用hook）**
### useReducer
适用于逻辑复杂或有多个状态的情况。(用法和redux原始用法很像，不常用，复杂数据存储常用第三方库)
```jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}

```
## 全局状态管理
### Context
当多个组件需要共享某些状态（如用户信息、主题色、登录状态）时，需要全局状态管理。
注意：Context 不适合频繁更新的状态，因为当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重新渲染，并使用最新传递给 MyContext provider 的
context value 值。可能会导致整个子树重渲染，影响性能。
[以上一些代码示例](https://github.com/ManMan3392/redrockhomework/commit/20588b46f7417eeb1b285cfefc54834dc22c1464)
### 状态管理库
#### redux
**Redux三大核心概念**
1. Redux是JavaScript的状态容器，提供了可预测的状态管理.
Redux通过State储存数据。
2. Redux要求我们通过action来更新数据,可以清晰的知道数据到底发生了什么样的变化，所有的数据变化都是可跟追、可预测的。
3. reducer做的事情就是将传入的state和action结合起来生成一个新的state。

**Redux的三大原则**
1. 单一数据源（整个应用程序的state被存储在一颗object tree中，并且这个object tree只存储在一个 store 中）
2. State是只读的（唯一修改State的方法一定是触发action，不要试图在其他地方通过任何的方式来修改State，这样可以保证所有的修改都被集中化处理，并且按照严格的顺序来执行，所以不需要担心race condition（竟态）的问题）
3. 使用纯函数来执行修改（reducer将 旧state和 actions联系在一起，并且返回一个新的State，所有的reducer都应该是纯函数，不能产生任何的副作用）
[关于redux原生使用的一些代码](https://github.com/ManMan3392/redrockhomework/commit/d748cbd4ecbd8d6b34fd74e2c6a3f6050e296d11)


**RTK**
redux的编写逻辑过于的繁琐和麻烦，Redux Toolkit包旨在成为编写Redux逻辑的标准方式。
[RTK使用代码](https://github.com/ManMan3392/redrockhomework/commit/bcad413115fd05f926e953fd93ae03878a13d287)