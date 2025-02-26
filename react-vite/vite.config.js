import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig((mode) => ({
	plugins: [
		react(),
		tailwindcss(),
		eslintPlugin({
			lintOnStart: true,
			failOnError: mode === "production",
		}),
	],
	resolve: {
		alias: {
			"@": "/src", // Ensures path aliasing works with or without TypeScript
		},
	},
	server: {
		open: true,
		proxy: {
			"/api": "http://127.0.0.1:8000",
		},
	},
}));
