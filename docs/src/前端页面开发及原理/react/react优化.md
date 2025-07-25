# react优化
## hook层面
1. useMemo
2. useCallback(1.2.详情见'react中常见hook')
3. ### useEffect依赖项优化
   精确控制依赖项数组，避免不必要的副作用执行。空数组 [] 表示仅挂载时运行一次。
4. ### useReducer 替代复杂 useState
   对于复杂状态逻辑，使用 useReducer 可减少渲染次数。
## 代码层面
1. ### 列表渲染优化：
   为列表项添加唯一且稳定的 key，这样的话在元素渲染时进行diff算法，可以尽可能复用节点，避免不必要的重新生成，节约性能。
2. ### 代码分割（Lazy Loading）
   使用 React.lazy 和 Suspense 动态加载组件，减少首屏体积。这样可以加快首屏渲染速度，给用户更好的体验感。
   ```jsx
    const LazyComponent = React.lazy(() => import('./LazyComponent'));
        <Suspense fallback={<Loading />}>
        <LazyComponent />
        </Suspense>
   ```
    底层实现：
    1. **创建 Lazy 组件**
        标记为 REACT_LAZY_TYPE，记录加载状态。
    2. **触发动态加载**
        Webpack在打包时会将动态导入（ import()）的模块拆分为独立的文件。
    3. **状态管理**
        通过 Promise 跟踪加载状态，利用 React 的渲染机制协调异步过程。
    4. **与 Suspense 协作**
        未完成时显示 fallback，完成后渲染组件。
    5. **错误处理**
        通过错误边界捕获加载失败。