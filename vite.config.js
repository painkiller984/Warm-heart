import { defineConfig } from "vite";
import { resolve } from "path";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                shop: resolve(__dirname, "shop.html"),
                shop2: resolve(__dirname, "shop-2.html"),
                card: resolve(__dirname, "card.html"),
                cart: resolve(__dirname, "cart.html"),
                contacts: resolve(__dirname, "contacts.html"),
                about: resolve(__dirname, "about.html"),
                FAQ: resolve(__dirname, "FAQ.html"),
                privacy: resolve(__dirname, "privacy.html"),
            },
        },
    },
    base: "./",
    plugins: [
        viteImagemin({
            mozjpeg: {
                quality: 75,
            },
            pngquant: {
                quality: [0.7, 0.9],
            },
            svgo: {
                plugins: [{ name: "removeViewBox", active: false }],
            },
            webp: {
                quality: 75,
            },
        }),
    ],
});
