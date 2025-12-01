import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
    base: "/", // ベースURLを明示的に設定
    server: {
        proxy: {
            "/v1/api": {
                target: "http://localhost:8090",
            },
        },
        cors: true, // すべてのドメインからのアクセスを許可
    },
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        outDir: "dist", // ビルド出力ディレクトリを明示的に設定
        assetsDir: "assets", // アセットディレクトリを明示的に設定
    },
});
