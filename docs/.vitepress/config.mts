import autoSidebar from "vite-plugin-vitepress-auto-sidebar";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blog/",
  title: "ManMan Blog",
  description: "Just do it!",
  head: [["link", { rel: "icon", href: "../public/avatar.ico" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "../public/avatar.ico",
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "前端页面开发",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/ManMan3392" }],
  },
  vite: {
    plugins: [
      // https://vitepress.dev/guide/extending-vitepress
      autoSidebar({
        ignoreList: ["assets", ".vitepress", "img"],
        beforeCreateSideBarItems: (data) => {
          // 筛选出“概述”相关的文件，这里假设文件名包含“概述”关键字
          const overviewFiles = data.filter((item) => item.includes("概述"));
          // 筛选出其他文件
          const otherFiles = data.filter((item) => !item.includes("概述"));
          // 重新组合数组，让“概述”相关文件在最前面
          return [...overviewFiles, ...otherFiles];
        },
      }),
    ],
  },
});
