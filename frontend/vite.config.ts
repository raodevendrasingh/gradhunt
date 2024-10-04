// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import viteImagemin from "vite-plugin-imagemin";

// Convert import.meta.url to a file path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	server: {
		proxy: {
			"/api": "http://localhost:8000",
		},
	},
	plugins: [
		react(),
		viteImagemin({
			gifsicle: {
				optimizationLevel: 7,
				interlaced: false,
			},
			optipng: {
				optimizationLevel: 7,
			},
			mozjpeg: {
				quality: 80,
			},
			pngquant: {
				quality: [0.8, 0.9],
				speed: 4,
			},
			svgo: {
				plugins: [
					{
						name: "removeViewBox",
					},
					{
						name: "removeEmptyAttrs",
						active: false,
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "dist",
		minify: "esbuild",
		sourcemap: false,
        chunkSizeWarningLimit: 500,
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						if (id.includes("react")) {
							return "vendor-react";
						}
						if (id.includes("@mui")) {
							return "vendor-mui";
						}
						if (id.includes("@emotion")) {
							return "vendor-emotion";
						}
						return "vendor-other";
					}
				},
			},
		},
	},
});
