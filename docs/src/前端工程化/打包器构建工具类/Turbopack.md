# Turbopack
## Turbopack介绍
**Turbopack** 是由 Vercel 团队（Next.js 的开发者）推出的一款全新前端构建工具，旨在取代传统的 Webpack，特别适用于 JavaScript 和 TypeScript 项目。它采用 Rust 编写，集成在 Next.js 中，专注于提升开发体验和构建性能。
## 核心特性
1. **极致构建速度**：urbopack 的性能表现非常出色，尤其在大型项目中优势明显。官方宣称其更新速度比 Vite 快 10 倍，比 Webpack 快 700 倍。例如，在一个包含 3000 个模块的应用中，Turbopack 启动时间仅需 1.8 秒，而 Vite 则需要 11.4 秒 。

2. **增量构建与缓存机制**:Turbopack 采用增量构建策略，只重新构建发生变化的部分，避免了不必要的计算和资源消耗。此外，它还实现了函数级别的缓存，确保相同的计算不会重复执行 。
    

3. **懒加载打包**:在开发模式下，Turbopack 仅打包开发服务器实际请求的内容，这种懒加载方法可以减少初始编译时间和内存使用，提升开发效率 。

4. **零配置支持**:Turbopack 在 Next.js 中开箱即用，支持 JavaScript、TypeScript、React、CSS、Sass、PostCSS 等常见功能，无需额外配置即可使用。

## 使用
要在 Next.js 项目中启用 Turbopack，只需在 package.json 的 dev 和 build 脚本中添加 --turbopack 标志：
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start"
  }
}

```
