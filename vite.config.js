import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
  ],
  test: {
    provider: "v8",
    environment: "jsdom", // Ensures DOM methods are available
    globals: true, // Enables `describe`, `test`, etc. globally
    coverage: {
      all: true,
      exclude: [
        "./src/pages/Company/testdata.js",
        "**/tests/**",
        "**/*.test.{js,jsx}",
        "**/__mocks__/**",
        "node_modules/**",
        "src/pages/Company/Components/Slider/PostSlide.jsx",
        "node_modules",
        "tests",
        "vite.config.js",
        "tailwind.config.js",
        "postcss.config.js",
        "package.json",
        "index.html",
        "eslint.config.js",
        ".gitignore",
        "src/setupTests.js",
        "src/main.jsx",
        "src/utils/**",
        "src/store/**",
        "src/pages/Feed/MainFeed/FeedPosts/PostCard/Content/MediaContent**",
        "src/pages/Feed/MainFeed/FeedPosts/PostCard/Comments/Reply.jsx",
        "src/pages/Feed/GenericComponents/reactionIcons.js",
        "src/mocks/**",
        "src/apis/**",
        "src/assets/**",
        "src/app/**",
      ],
    },
    setupFiles: "./src/setupTests.js",
  },
  server: {
    historyApiFallback: true,
  },
});
