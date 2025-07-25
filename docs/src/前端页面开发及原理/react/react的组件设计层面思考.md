# react的组件设计层面思考
## 性能优化
1. 使用 React.memo 进行组件记忆化。
2. 使用性能优化函数：
     useMemo
     useCallback
## 结构优化
1. 单一职责原则：
     一个组件只处理一类事情（UI、逻辑、状态），可读性强、复用性好。
2. 使用自定义 Hook 抽离可复用逻辑：

```jsx
function useUserData(userId) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData(userId).then(setData);
  }, [userId]);
  return data;
}
```
