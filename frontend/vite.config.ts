// import path from "path"
// import tailwindcss from "@tailwindcss/vite"
// import react from "@vitejs/plugin-react"
// import { defineConfig, loadEnv } from "vite"

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//   proxy: {
//     '/auth': 'https://ledger-wallet-wlin.onrender.com',
//     '/user': 'https://ledger-wallet-wlin.onrender.com',
//     '/wallet': 'https://ledger-wallet-wlin.onrender.com',
//     '/admin': 'https://ledger-wallet-wlin.onrender.com',
//   }
// }
// })


import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load .env file based on mode (development/production)
  const env = loadEnv(mode, process.cwd());

  const RENDER_URL = env.VITE_BACKEND_URL; // e.g., "https://ledger-wallet-wlin.onrender.com"

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
      '/auth': RENDER_URL,
      '/user': RENDER_URL,
      '/wallet': RENDER_URL,
      '/admin': RENDER_URL,
      '/payment': RENDER_URL,
      '/transfer': RENDER_URL,
      },
    },
  };
});
