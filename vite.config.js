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
        "src/pages/Feed/GenericComponents/reactionIcons.js",
        "src/pages/Feed/MainFeed/FeedPosts/Post/Content/MediaContent/PdfViewer.jsx",
        "src/pages/Company/Components/Slider/PostsSlider.jsx",
        "src/pages/Company/Components/Pages/PostsPage.jsx",
        "src/Pages/UserProfile/Components/Sections/ResumeSection.jsx",
        "src/pages/UserProfile/Components/UserPostsSlider/UserPostsSlider.jsx",
      ],
    },
    setupFiles: "./src/setupTests.js",
  },
  server: {
    allowedHosts: ["tawasolapp.me", "www.tawasolapp.me"],
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
