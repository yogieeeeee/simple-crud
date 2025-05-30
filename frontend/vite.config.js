import path from "path"
import tailwindcss from "tailwindcss"
import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"
import dotenv from "dotenv"

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env.VITE_API_ENDPOINT": JSON.stringify(
      process.env.VITE_API_ENDPOINT
    )
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
