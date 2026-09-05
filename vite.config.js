import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages sirve el sitio en /fby-deck/, no en la raíz
  base: "/fby-deck/",
  server: { port: 5180, open: true },
});
