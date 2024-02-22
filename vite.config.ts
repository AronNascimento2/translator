import { defineConfig } from "vite";
import replace from "@rollup/plugin-replace";
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    replace({
      "process.env.API_KEY": JSON.stringify(process.env.API_KEY),
    }),
  ],
});
