// vite.config.js
import { defineConfig } from "file:///H:/SkillHub/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///H:/SkillHub/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcjs from "file:///H:/SkillHub/frontend/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcjs()
  ],
  build: {
    // Re-enable module preload for optimal browser prefetching
    modulePreload: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached separately, rarely changes
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // UI icon library — large but static
          "vendor-ui": ["lucide-react"],
          // Auth & state — changes independently of UI
          "vendor-auth": ["@react-oauth/google", "zustand"],
          // HTTP & analytics
          "vendor-utils": ["axios", "@vercel/analytics"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJIOlxcXFxTa2lsbEh1YlxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiSDpcXFxcU2tpbGxIdWJcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0g6L1NraWxsSHViL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB0YWlsd2luZGNqcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB0YWlsd2luZGNqcygpXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gUmUtZW5hYmxlIG1vZHVsZSBwcmVsb2FkIGZvciBvcHRpbWFsIGJyb3dzZXIgcHJlZmV0Y2hpbmdcbiAgICBtb2R1bGVQcmVsb2FkOiB0cnVlLFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNjAwLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAvLyBDb3JlIFJlYWN0IHJ1bnRpbWUgXHUyMDE0IGNhY2hlZCBzZXBhcmF0ZWx5LCByYXJlbHkgY2hhbmdlc1xuICAgICAgICAgICd2ZW5kb3ItcmVhY3QnOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgLy8gVUkgaWNvbiBsaWJyYXJ5IFx1MjAxNCBsYXJnZSBidXQgc3RhdGljXG4gICAgICAgICAgJ3ZlbmRvci11aSc6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgICAgICAgLy8gQXV0aCAmIHN0YXRlIFx1MjAxNCBjaGFuZ2VzIGluZGVwZW5kZW50bHkgb2YgVUlcbiAgICAgICAgICAndmVuZG9yLWF1dGgnOiBbJ0ByZWFjdC1vYXV0aC9nb29nbGUnLCAnenVzdGFuZCddLFxuICAgICAgICAgIC8vIEhUVFAgJiBhbmFseXRpY3NcbiAgICAgICAgICAndmVuZG9yLXV0aWxzJzogWydheGlvcycsICdAdmVyY2VsL2FuYWx5dGljcyddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUCxTQUFTLG9CQUFvQjtBQUNqUixPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsZUFBZTtBQUFBLElBQ2YsdUJBQXVCO0FBQUEsSUFDdkIsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBO0FBQUEsVUFFWixnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUE7QUFBQSxVQUV6RCxhQUFhLENBQUMsY0FBYztBQUFBO0FBQUEsVUFFNUIsZUFBZSxDQUFDLHVCQUF1QixTQUFTO0FBQUE7QUFBQSxVQUVoRCxnQkFBZ0IsQ0FBQyxTQUFTLG1CQUFtQjtBQUFBLFFBQy9DO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
