# vite
## vite介绍
vite是一种新型前端构建工具，能够显著提升前端开发体验。
它主要由两部分组成：
一个开发服务器，它基于**原生ES模块**提供了丰富的内建功能，在开发过程中，Vite 假设使用的是现代浏览器。这意味着该浏览器支持大多数最新的 JavaScript 和 CSS 功能。因此，Vite 将 esnext 设置为转换目标。这可以**防止语法降低**，使 Vite 能够尽可能接近原始源代码提供模块。这就是vite构建速度之一。在开发环境的语法解析时，vite采用<a href='./esbuild.md'>esbuild</a>，一个基于Go语言的打包工具，打包速度快。

一套构建指令，在生产打包时，Vite 采用了<a href='./rollup.md'>Rollup</a>灵活的插件 API 和基础建设，能够输出高度优化的静态资源。虽然Rollup速度没有esbuild快，但它已经开始着手改进性能，在 v4 中将其解析器切换到<a href='../语法转换编译类/swc.md'>SWC</a>。同时还有一个正在进行中的工作，即构建一个名为<a href='./rolldown.md'> Rolldown </a>的 Rust 版本的 Rollup。一旦 Rolldown 准备就绪，它就可以在 Vite 中取代 Rollup 和 esbuild，显著提高构建性能，并消除开发和构建之间的不一致性。

## vite的基本使用
因为vite采用预配置的方式，所以使用vite时，需要配置的地方少之又少，基本开箱即用。
下面是vite使用时安装的一些环境及命令，可以看到vite并不需要配置太多的插件，内部已经完善好了。命令也相当简单。
[手动构建vite项目示例](https://github.com/ManMan3392/redrockhomework/tree/main/vite)
除此之外，我们还可以运用vite的脚手架创建项目，甚至连上述简单的配置都不需要我们完成。
```js
pnpm create vite
```
vite还有很多功能和原理，我目前只是会用，等待后续完善吧~