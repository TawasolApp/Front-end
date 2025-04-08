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
    environment: "jsdom", // Ensures DOM methods are available
    globals: true, // Enables describe, test, etc. globally
    provider: "v8",
    coverage: {
      all: true,
      include: ["src/pages/Company/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        // MAIN ITEMS FOR EXCLUSIONS
        "**/tests/**",
        "**/node_modules/**",
        "**/mocks/**",
        "**/assets/**",
        "**/utils/**",
        "**/store/**",
        "**/app/**",
        "**/apis/**",
        "**/setupTests.js",
        "**/main.jsx",
        "**/index.html",
        "**/package.json",
        "**/postcss.config.js",
        "**/tailwind.config.js",
        "**/vite.config.js",
        "**/eslint.config.js",
        "**/.gitignore",

        // ITEMS WITH SPECIFIC EXCLUSIONS
        "src/pages/Feed/MainFeed/FeedPosts/PostCard/Content/MediaContent**",
        "src/pages/Feed/MainFeed/FeedPosts/PostCard/Comments/Reply.jsx",
        "src/pages/Feed/GenericComponents/reactionIcons.js",

        // CHECK WITH KHALED
        "src/pages/AuthenticationPages/**",
      ],
    },
    setupFiles: "./src/setupTests.js",
  },
});
