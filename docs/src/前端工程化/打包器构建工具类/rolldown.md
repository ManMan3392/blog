# Rolldown
## Rolldown介绍
因为 **Vite** 的生产速度往往受 **Rollup** 性能限制，所以**Rolldown**出现了。

**Rolldown** 是一个用 **Rust** 编写的 **Rollup** 兼容构建器，由 Vite 团队主导开发。
它的目标是：

- 性能大幅提升（Rust + 多线程）。

- 完全兼容 Rollup 插件 API（迁移成本低）。

- 更现代的架构，便于未来优化代码分割、产物优化等功能。

- 成为 Vite 的默认生产构建器，替换 Rollup。
  
## Rolldown优势
| 技术点    | Rolldown               | Rollup           |
| ------ | ---------------------- | ---------------- |
| 实现语言   | Rust（编译型，性能接近 C++）     | JavaScript（解释执行） |
| 并行能力   | 多线程并行（Rayon）           | 单线程              |
| AST 处理 | 自研高性能解析器（SWC / oxc 思路） | Acorn 解析器（JS）    |
| 内存管理   | 静态类型 + 生命周期管理          | JS GC（垃圾回收）      |
| 插件支持   | 直接复用 Rollup 插件 API     | Rollup 原生        |

