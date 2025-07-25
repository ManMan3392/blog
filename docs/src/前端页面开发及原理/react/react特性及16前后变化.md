# react特性及16前后变化
## react主要特性
1. ### 组件化开发       
    一个组件是 UI（用户界面）的一部分，它拥有自己的逻辑和外观。可复用。
2. ### JSX（JavaScript XML）
   React认为渲染逻辑本质上与其他UI逻辑存在内在耦合。故而出现JSX。
   可以在 JS 中写 HTML 结构。JSX 会被 Babel 编译为 React.createElement() 调用。
3. ### 单向数据流
   数据自上而下流动（从父组件传到子组件），利于数据的可控性和调试。
4. ### 虚拟 DOM（Virtual DOM）
   React 会先构建一个组件对应的虚拟 DOM 树（在内存中），每次状态变更时，先在虚拟 DOM 上进行 diff 操作，再映射到真实 DOM，提高性能。
5. ### 声明式编程
   描述“做什么”而非“怎么做”。你不需要直接进行DOM操作，就可以从手动更改DOM、属性操作、事件处理中解放出来；
## React 的 Diff 算法
用于比较更新前后的虚拟 DOM 树，找出差异部分进行最小化更新。
React利用ReactElement对象组成了一个**JavaScript的对象树**，就是**虚拟DOM（Virtual DOM）**。在 props 或 state 改变时，React 会重新构建虚拟 DOM，并通过协调（Reconciliation）机制找到变化部分，最终同步到真实 DOM。
在协调阶段，React 的 Diff 算法会比较新虚拟 DOM（VDOM）与旧 Fiber 子节点的 key 和 type，判断每个节点是否可以复用、需要插入、删除或替换。对于可复用的节点，会保留原有的 DOM 并更新属性，对于不可复用的节点则标记为删除并创建新节点。

新构建的 Fiber 子节点链表（Fiber Tree）会挂载到当前节点的 .child 上，整个过程中还会为每个节点设置相应的副作用标记（flags），如 Placement、Update、Deletion 等，用于提交阶段执行实际的 DOM 操作。

如果没有 Diff 算法，React 将无法精准判断节点的变化，哪怕只是子元素位置调换，也会认为是两个全新节点，导致销毁旧节点、创建新节点，从而丧失复用性、降低性能，影响用户体验。

Diff只比较同一父节点下的子节点，不会跨层级比较，这样能减少比较范围提升性能。如果节点类型不同，产生不同的树结构。可以通过key来指定哪些节点在不同的渲染下保持稳定：
1. React 默认按顺序比较新旧子节点，仅在节点数量较多时（如超过 32 个）才构建旧节点 Map 来优化性能；
2. 再遍历新子节点，查找是否能复用旧节点；
3. 匹配不到则插入新节点，匹配到了则移动或更新。
## Fiber 架构（React 16+）
React Fiber 是一个可中断、可恢复、基于优先级调度的**协调引擎**，它让 React 真正成为一个可控 UI 渲染引擎，不仅仅是一个视图库。
### React 16 后的渲染架构
React 渲染流程可以拆成**三个核心部分**：
1. Scheduler（调度器）:分配时间片，调度优先级，**决定何时开始执行更新任务**
2. Reconciler（协调器）:构建 Fiber 树，执行组件逻辑，生成 effectList（变更列表）
3. Renderer（渲染器）:把变更应用到真实平台（DOM、原生、Canvas...）
#### 现在我们来看看**渲染流程**吧！
1. **Render Phase（协调阶段）（使用Diff算法的地方）**
   React 每次更新时，会用 新的 VDOM（虚拟 DOM）树 去对比 旧的 Fiber Tree，以确定要执行的更新操作。这个过程就叫 Reconciliation（协调），它的核心就是 Diff 算法。
   流程如下：
   1. Scheduler 安排更新任务（setState、props变更等）入队
   2. 从 root Fiber 开始调用 beginWork（构建当前 Fiber 子节点（使用Diff算法优化，最大可能复用子节点），执行组件函数/类 render）
   3. 遍历构建新的 workInProgress Fiber 树
   4. 比较 old Fiber（current） 和 新 VDOM（next）
   5. 收集变更信息（effect）
   6. 构建完成后，等待进入 commit 阶段
   
   注意哦：这个阶段是**可中断的**，Fiber 架构支持可中断的协调过程，但实际是否中断取决于是否启用了并发模式（如 createRoot() 进入 Concurrent Mode）。渲染任务不会阻塞主线程，支持暂停、恢复、重试。**支持优先级**，重要任务先执行（例如：用户输入 > 动画 > 异步数据加载），如果任务超时或优先级高，会抢占当前任务，提高响应性，**不操作 DOM**，只是操作虚拟 DOM。
2. **Commit Phase（提交阶段）**
   把收集到的 effect 执行到真实 DOM 中（插入/更新/删除 DOM 元素）。
   流程如下：
   1. Before Mutation
   - 获取旧 DOM 信息（用于 snapshot）
   2. Mutation
   - 执行 DOM 操作（插入/更新/删除）
      提交新的 workInProgress 树替换为 current 树
   3. Layout
   - 执行副作用（如 useLayoutEffect、componentDidMount）
  
  特点：
   1. 不可中断
   2. 快速完成所有 DOM 更新
   3. 最后刷新画面，触发浏览器绘制
   
为啥要**两棵树**捏？只保存一个虚拟DOM不是更节约吗？
因为两棵树可以——
1. 构建期间不中断页面展示；
2. 可以打断/恢复更新；
3. 有“回滚”空间。
## react16前后对比：
| 特性/版本    | React 16 之前            | React 16（Fiber）之后                |
| ------------ | ------------------------ | ------------------------------------ |
| 渲染过程     | 同步递归，不能中断       | 可中断、增量、优先级调度的 Fiber 树  |
| 错误处理     | 一处出错，整个页面崩溃   | 引入 Error Boundaries，局部处理错误  |
| 渲染能力     | 无法中断、低优先级响应慢 | 可打断任务，响应用户更及时           |
| 支持的功能   | 基础渲染                 | 支持 Suspense、Concurrent Mode 等    |
| 内部数据结构 | 虚拟 DOM 树              | Fiber 树（链表结构，能记录更多信息） |

(表格来源于gpt的大力支持)
