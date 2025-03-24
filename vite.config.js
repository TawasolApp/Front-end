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
    coverage: {
      all: true,
      include: ["src/pages/CompanyPage/Components/**/*.{js,jsx}"],
      exclude: [
        "**/tests/**",
        "**/*.test.{js,jsx}",
        "**/__mocks__/**",
        "node_modules/**",
        "src/pages/CompanyPage/Components/PostSlide.jsx",
      ],
    },
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
  server: {
    historyApiFallback: true,
  },
});
