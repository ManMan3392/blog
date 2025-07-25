# React的class组件vs函数式组件
## 组件化开发
### 为什么要有组件化开发
如果我们将一个页面中所有的处理逻辑全部放在一起，处理起来就会变得非常复杂，而且不利于后续的管理以及扩展。所以我们想将一个页面拆分成一个个小的功能块，每个功能块完成属于自己这部分独立的功能。每一个组件又可以进行细分，而且组件本身可以在多个地方进行复用。所以我们要尽可能的将页面拆分成一个个小的、可复用的组件。
### 组件的分类
根据不同的方式可以分成很多组件。
- 根据组件的定义方式:函数组件(Functional Component ),类组件(Class Component)
- 根据组件内部是否有状态需要维护:无状态组件(Stateless Component ),有状态组件(Stateful Component)
- 根据组件的不同职责:展示型组件(Presentational Component),容器型组件(Container Component)
前者更关心UI的展示，后者更关心数据逻辑。
## class组件
### 基本写法
**使用class定义一个组件：**
- constructor是可选的，我们通常在constructor中初始化一些数据。
- this.state中维护的就是我们组件内部的数据。
- render() 方法是 class 组件中唯一必须实现的方法。
```jsx
import React, { PureComponent } from 'react'
import { islogin } from '../utils/islogin'
export class Login extends PureComponent {
    render() {
        const { token } = this.props
        console.log(this.props)
        return (
            <div>{token}</div>
        )
    }
}

export default islogin(Login)
```
### 生命周期
很多的事物都有从创建到销毁的整个过程，这个过程称之为是生命周期。
生命周期的整个过程，分成了很多个阶段：
- 装载阶段（Mount）：组件第一次在DOM树中被渲染的过程。
- 更新过程（Update）：组件状态发生变化，重新更新渲染的过程。
- 卸载过程（Unmount）：组件从DOM树中被移除的过程。
React内部为了告诉我们当前处于哪些阶段，会对我们组件内部实现的某些函数进行回调，这些函数就是生命周期函数。
- 实现componentDidMount函数：组件已经挂载到DOM上时，就会回调。
- 实现componentDidUpdate函数：组件已经发生了更新时，就会回调。
- 实现componentWillUnmount函数：组件即将被移除时，就会回调。
## 函数式组件
使用function来进行定义的函数，这个函数会返回和类组件中render函数返回一样的内容。
```jsx
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
### class组件相对于函数式组件的优势：
- class组件可以定义自己的state，用来保存组件自己内部的状态。函数式组件不可以，因为函数每次调用都会产生新的临时变量。
- class组件有自己的生命周期，我们可以在对应的生命周期中完成自己的逻辑。（比如在componentDidMount中发送网络请求，并且该生命周期函数只会执行一次。函数式组件在学习hooks之前，如果在函数中发送网络请求，意味着每次重新渲染都会重新发送一次网络请求。）
-  class组件可以在状态改变时只会重新执行render函数以及我们希望重新调用的生命周期函数componentDidUpdate等。函数式组件在重新渲染时，整个函数都会被执行。
### 函数式组件的Hook
Hook的出现基本可以代替我们之前所有使用class组件的地方。
1. useState会帮助我们定义一个state变量，useState 是一种新方法，它与 class 里面的this.state 提供的功能完全相同。一般来说，在函数退出后变量就会”消失”，而state 中的变量会被React 保留。
2. Effect Hook 可以完成一些类似于class中生命周期的功能。（完成一些类似于class中生命周期的功能，网络请求、手动更新DOM、一些事件的监听）
   **useEffect的解析**：
   1. 通过useEffect的Hook，可以告诉React需要在渲染后执行某些操作。
   2. useEffect要求我们传入一个回调函数，在React执行完更新DOM操作之后，就会回调这个函数。
   3. 默认情况下，无论是第一次渲染之后，还是每次更新之后，都会执行这个回调函数。
    ```jsx
    useEffect(() => {
    // 副作用逻辑
    return () => {
        // 可选：清除逻辑（如取消订阅）
    };
    }, [deps]);//依赖项

    ```
### Class组件存在的问题
- 复杂组件变得难以理解：它们的逻辑往往混在一起，强行拆分反而会造成过度设计，增加代码的复杂度
- 难以理解的class：必须搞清楚this的指向到底是谁
- 组件复用状态很难
### 函数式组件相对于class组件的优势
1. 代码更简洁，无样板代码
2. 无 this 绑定问题
3. 状态逻辑更灵活，通过 useEffect 可以将相关逻辑放在一起，避免代码碎片化：
   ```jsx
    function FunctionalComponent() {
    const [data, setData] = React.useState(null);

    // 合并了 class 组件中 componentDidMount 和 componentDidUpdate 的逻辑
    React.useEffect(() => {
        fetchData().then(result => setData(result));
    }, [dependency]); // 依赖项变化时自动重新执行
    }
   ```
4. 副作用管理更直观:
   - Class 组件：副作用（如订阅、定时器）分散在 componentDidMount 和 componentWillUnmount 中，容易遗漏清理逻辑。
   - 函数式组件：useEffect 通过返回清理函数确保资源释放，逻辑更统一
    ```jsx
    React.useEffect(() => {
    const subscription = api.subscribe(); // 订阅
    return () => subscription.unsubscribe(); // 自动在卸载时清理
    }, []);
    ```
5. 逻辑复用更简单:
    - Class 组件：复用状态逻辑需要使用 HOC（高阶组件）或 Render Props，导致组件嵌套层级过深（“嵌套地狱”）。
    - 函数式组件：通过自定义 Hook 可以轻松复用状态逻辑，且不会增加组件层级。
6. 性能优化更精细：
   - Class 组件：只能通过 shouldComponentUpdate 或 PureComponent 进行浅层比较，不够灵活。
   - 函数式组件：通过 React.memo、useCallback 和 useMemo 可以更精确地控制渲染：

   
