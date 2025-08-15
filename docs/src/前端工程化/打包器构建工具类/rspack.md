# rspack
## rspack介绍
**rspack** 是一个高性能的 JavaScript 打包工具，采用 Rust 编写，旨在提供比传统 JavaScript 打包工具更快的构建速度和更好的开发体验。
## rspack和其他工具的对比
| 特性                    | Rspack        | Rollup   | Turbopack    |   |
| --------------------- | ------------- | -------- | ------------ | - |
| 构建速度                  | 极快            | 较慢       | 快，但迁移成本高     |   |
| 插件生态                  | 强（兼容 Webpack） | 强（专注库打包） | 新兴，生态待完善     |   |
| 适用场景                  | 应用打包          | 库打包      | 微前端、React 专用 |   |
| 语法降级（Syntax Lowering） | 支持（内置）        | 需外部插件支持  | 支持（内置）       |   |

个人感觉rspack对于webpack项目的迁移相对于vite更加友好，而vite的又是主要在于他的配置简单，而rspack的配置相对复杂。
