import { defineConfig } from "vite"
// import react from "@vitejs/plugin-react-swc"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  plugins: [react(), flowbiteReact()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})