# react生命周期
React 的生命周期是指组件从创建到销毁的整个过程中的各个阶段。
## Hooks 实现
**useEffect**或者**useLayoutEffect**
useEffect只在被挂载时或者依赖项number更新时才调用。
```jsx
useEffect(() => {
  console.log("组件挂载");

  return () => {
    console.log("组件卸载时需要完成的操作");

  };
}, [number]);
```
### useEffect的区别useLayoutEffect：
**useLayoutEffect **会在浏览器绘制页面之前执行，可以同步读取布局信息或修改 DOM。
**useEffect**是异步的，会在页面已经“画出来”之后（既浏览器已绘制完页面）才执行，不会阻塞用户看到页面。
#### 使用场景：
**useEffect**：
1. 网络请求
2.订阅/解绑
3. 页面标题更改、事件监听
4. 延时操作（setTimeout/setInterval）
**useLayoutEffect**：
1. 读取 DOM 布局信息（如 getBoundingClientRect()）
2. 防止闪烁、抖动的 UI 修改（例如：文字在加载后，根据宽度调整缩放比例，如果用 useEffect，用户会先看到默认样式再看到缩放效果（出现闪烁）；而 useLayoutEffect 可以在渲染前修改样式，防止闪烁。）
### 生命周期演变
在类组件中，生命周期分为三个阶段：
1. 挂载
```jsx
constructor()         // 构造函数，初始化状态
componentDidMount()   // DOM 已挂载，适合发送网络请求

```
2. 更新
```jsx
shouldComponentUpdate()    // 控制是否更新组件
componentDidUpdate()       // DOM 更新后调用

```
3. 卸载
```jsx
componentWillUnmount()     // 组件卸载前调用，适合清理副作用

```
在react16.8后，Hooks 正式发布，函数组件也能拥有生命周期能力，成为主流做法