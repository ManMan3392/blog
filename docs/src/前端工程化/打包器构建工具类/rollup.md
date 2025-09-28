# Rollup

## Rollup 介绍

**Rollup** 是一个用 JavaScript 编写的 **ES Module**打包工具，最早在 2015 年发布。
它的设计目标是输出最精简、可读性高、运行时负担小的打包文件，非常适合打包 **库（library）** 而不是大型应用。

## Rollup 特点

- **原生 ESM 支持**：从一开始就基于 ES Module 静态分析进行 Tree Shaking。

- **输出干净**：不额外插入复杂的运行时代码。

- **插件驱动**：核心很小，几乎所有功能靠插件实现（如 Babel、TypeScript 支持）。

- **格式多样**：esm、cjs、iife、umd 都支持。

- **适合库打包**：很多知名库（React、Vue、Three.js、Lodash-es）都用 Rollup。

## rollup 的 jsAPI 方式调用

我们平时写配置文件打包其实是 rollup 内置的 cli 帮我们完成了传入配置这个操作，但有些场景下我们需要基于 Rollup 定制一些打包过程，配置文件就不够灵活了，这时候我们需要用到对应 JavaScript API 来调用 Rollup
以下讲两个 api:

- rollup.rollup: 该方法接收一个配置对象，返回一个 Promise，Promise 解析后会返回一个包含打包结果的对象（bundle）。主要用于一次性打包，我们可以创建一个 build.js，代码如下：

  ```js
  const rollup = require("rollup");

  // 常用 inputOptions 配置
  const inputOptions = {
    input: "./src/index.js",
    external: [],
    plugins: [],
  };

  const outputOptionsList = [
    // 常用 outputOptions 配置
    {
      dir: "dist/es",
      entryFileNames: `[name].[hash].js`,
      chunkFileNames: "chunk-[hash].js",
      assetFileNames: "assets/[name]-[hash][extname]",
      format: "es",
      sourcemap: true,
      globals: {
        lodash: "_",
      },
    },
    // 省略其它的输出配置
  ];

  async function build() {
    //rollup打包主要经过了input build output 三个阶段
    let bundle;
    let buildFailed = false;
    try {
      // 1. 调用 rollup.rollup 生成 bundle 对象
      bundle = await rollup.rollup(inputOptions);
      //这个阶段主要是存储各个模块的内容及依赖关系，同时暴露generate和write方法，以进入到后续的 Output 阶段
      for (const outputOptions of outputOptionsList) {
        // 2. 拿到 bundle 对象，根据每一份输出配置，调用 generate 和 write 方法分别生成和写入产物
        const { output } = await bundle.write(outputOptions);
        console.log(output);
        //write方法打包完产物会写入磁盘
        // const { output } = await bundle.generate(outputOptions);
        //gennerate打包产物不会
      }
    } catch (error) {
      buildFailed = true;
      console.error(error);
    }
    if (bundle) {
      // 最后调用 bundle.close 方法结束打包
      await bundle.close();
    }
    process.exit(buildFailed ? 1 : 0);
  }

  build();
  ```

- rollup.watch:可以完成 watch 模式下的打包，即每次源文件变动后自动进行重新打包。代码如下：

  ```js
  // watch.js
  const rollup = require("rollup");

  const watcher = rollup.watch({
    // 和 rollup 配置文件中的属性基本一致，只不过多了`watch`配置
    input: "./src/index.js",
    output: [
      {
        dir: "dist/es",
        format: "esm",
      },
      {
        dir: "dist/cjs",
        format: "cjs",
      },
    ],
    watch: {
      exclude: ["node_modules/**"],
      include: ["src/**"],
    },
  });

  // 监听 watch 各种事件
  watcher.on("restart", () => {
    console.log("重新构建...");
  });

  watcher.on("change", (id) => {
    console.log("发生变动的模块id: ", id);
  });

  watcher.on("event", (e) => {
    if (e.code === "BUNDLE_END") {
      console.log("打包信息:", e);
    }
  });
  ```
上面两种api也可以引入config.js文件传入配置而非将代码直接传入，都是通过node运行文件使用的

## rollup插件机制
rollup插件可以大致分为两类：Build Hook 与 Output Hook。
- build Hook即在Build阶段执行的钩子函数，在这个阶段主要进行模块代码的转换、AST 解析以及模块依赖的解析，那么这个阶段的 Hook 对于代码的操作粒度一般为模块级别，也就是单文件级别。
- Ouput Hook(官方称为Output Generation Hook)，则主要进行代码的打包，对于代码而言，操作粒度一般为 chunk级别(一个 chunk 通常指很多文件打包到一起的产物)。

## rollup插件机制
核心就是一套内置的生命周期 hooks（buildStart、resolveId、load、transform、generateBundle 等）。打包时照这些阶段来执行，插件只需要实现对应 hook，就会在合适的时间点被调用。完成相应的工作。
## 常用hook
1. 路径解析: resolveId
   一般用来解析模块路径，为Async + First类型即异步优先的钩子，入参分别是当前模块路径、引用当前模块的模块路径、解析参数，返回值可以是 null、string 或者一个对象。
   - 返回值为 null 时，会默认交给下一个插件的 resolveId 钩子处理。
   - 返回值为 string 时，则停止后续插件的处理。
   - 返回值为一个对象，也会停止后续插件的处理，不过这个对象就可以包含更多的信息了，包括解析后的路径、是否被 enternal、是否需要 tree-shaking 等等。
2. load
   load 为Async + First类型，即异步优先的钩子，和resolveId类似。它的作用是通过 resolveId 解析后的路径来加载模块内容。
  load 钩子的入参是模块 id，返回值一般是 null、string 或者一个对象
  - 如果返回值为 null，则交给下一个插件处理。
  - 如果返回值为 string 或者对象，则终止后续插件的处理，如果是对象可以包含 SourceMap、AST 等更详细的信息。
3. 代码转换: transform
   transform 钩子为Async + Sequential类型，也就是异步串行钩子，作用是对加载后的模块内容进行自定义的转换。
   入参分别为模块代码、模块 ID，返回一个包含 code(代码内容) 和 map(SourceMap 内容) 属性的对象，当然也可以返回 null 来跳过当前插件的 transform 处理。需要注意的是，当前插件返回的代码会作为下一个插件 transform 钩子的第一个入参，实现类似于瀑布流的处理。
4. Chunk 级代码修改: renderChunk
   有两个入参，分别为 chunk 代码内容、chunk 元信息，返回值跟 transform 钩子类似，既可以返回包含 code 和 map 属性的对象，也可以通过返回 null 来跳过当前钩子的处理。
5. 产物生成最后一步: generateBundle
   异步串行的钩子，可以在这个钩子里面自定义删除一些无用的 chunk 或者静态资源，或者自己添加一些文件。
   入参分别为output 配置、所有打包产物的元信息对象，通过操作元信息对象可以删除一些不需要的 chunk 或者静态资源，也可以通过 插件上下文对象的emitFile方法输出自定义文件。