# Parcel
## Parcel介绍
**Parcel** 是一个**零配置（zero-config）**、**快速**的现代前端打包工具，由 Devon Govett 开发。它的目标是让前端开发者无需复杂配置即可快速开始项目，同时支持现代 JavaScript、TypeScript、React、Vue 等框架和各种资源文件（CSS、图片、字体等）的打包。
## Parcel与其他工具对比
| 特性   | Parcel      | Webpack               | Vite                 |
| ---- | ----------- | --------------------- | -------------------- |
| 配置难度 | 极低，零配置      | 高，需要 loader、plugin 配置 | 低，中等，依赖 Rollup       |
| 启动速度 | 快           | 慢（复杂配置慢）              | 非常快（利用原生 ESM）        |
| 构建速度 | 快（多线程 + 缓存） | 较慢                    | 非常快（esbuild）         |
| HMR  | 内置          | 需要配置                  | 内置                   |
| 文件支持 | 内置多类型       | 依赖 loader             | JS/TS 内置，CSS/静态资源需插件 |
| 目标   | 开发效率 & 简单项目 | 大型项目 & 可扩展性           | 开发效率 & 现代前端          |
## Parcel 内部其实是一个 集成化的现代构建工具链：
Parcel
├─ Transformer（文件类型转换器，如 Babel, PostCSS, esbuild）
├─ Resolver（模块解析器）
├─ Bundler（打包器）
├─ Packager（输出文件打包策略）
├─ Optimizer（压缩 JS/CSS/图片）
└─ Reporter（日志、进度显示）
