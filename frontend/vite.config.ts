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
  const env = loadEnv(mode, process.cwd());

  const RENDER_URL = env.VITE_BACKEND_URL;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
      '/auth': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
      '/wallet': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
      '/payment': 'http://localhost:3000',
      '/transfer': 'http://localhost:3000',
      },
    },
  };
});
