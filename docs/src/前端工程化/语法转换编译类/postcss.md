# postcss
## postcss介绍
是一个处理 CSS 的 AST 引擎 + 插件生态。它把 CSS 解析成 AST，按顺序跑一串插件进行转换，再输出新的 CSS。它是“中间层”，由插件决定能力。可以自动补前缀、把未来 CSS 特性降级、按需压缩、变量与嵌套、原子化/实用类框架（Tailwind 就是 PostCSS 插件）等。