# esbuild
## esbuild介绍
**esbuild** 是一个用 **Go** 语言编写的超高速 JavaScript/TypeScript 打包与构建工具。它能完成打包、转译（Transpile）、压缩（Minify）等前端构建任务。
它的目标是极致速度和简化配置，适合在开发环境和某些生产构建中替代 Webpack、Rollup、Babel 等部分功能。
## 优势所在
| 技术点   | esbuild 设计                            | Babel/Webpack 设计              |
| ----- | ------------------------------------- | ----------------------------- |
| 编程语言  | Go（编译型，静态类型，内存管理高效）                   | JavaScript（解释执行，GC 延迟大）       |
| 并行执行  | 多核并行，利用 Go 的 goroutine + channel 并发模型 | 单线程（JS 本身限制）                  |
| 解析与构建 | 自己实现的 **零依赖解析器**，直接生成 AST             | Babel 会先用 JS 写的解析器生成 AST      |
| 内存管理  | 统一管理 AST 节点，减少 GC 压力                  | JS AST 节点频繁分配/回收              |
| I/O   | 高效文件读取，最小化磁盘访问次数                      | 依赖 Node FS 模块，相对较慢            |
| 构建模式  | **单进程内并行编译**                          | 多阶段串行执行（loader → plugin → 打包） |
