# Rollup
## Rollup介绍
**Rollup** 是一个用 JavaScript 编写的 **ES Module**打包工具，最早在 2015 年发布。
它的设计目标是输出最精简、可读性高、运行时负担小的打包文件，非常适合打包 **库（library）** 而不是大型应用。
## Rollup特点
- **原生 ESM 支持**：从一开始就基于 ES Module 静态分析进行 Tree Shaking。

- **输出干净**：不额外插入复杂的运行时代码。

- **插件驱动**：核心很小，几乎所有功能靠插件实现（如 Babel、TypeScript 支持）。

- **格式多样**：esm、cjs、iife、umd 都支持。

- **适合库打包**：很多知名库（React、Vue、Three.js、Lodash-es）都用 Rollup。