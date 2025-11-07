import type { VitePWAOptions } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
// Plugins
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Unfonts from 'unplugin-fonts/vite'
import Components from 'unplugin-vue-components/vite'
// Utilities
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

import { VitePWA } from 'vite-plugin-pwa'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const pwaOptions: Partial<VitePWAOptions> = {
	base: '/',
	registerType: 'prompt',
	includeAssets: ['favicon.ico'],
	workbox: { cleanupOutdatedCaches: true },
	manifest: {
		display: 'standalone',
		name: 'Beluga Snooze',
		description: 'Those in the know - know',
		short_name: 'Beluga Snooze',
		theme_color: '#FFFBBC',
		background_color: '#FFFBBC',
		icons: [
			{
				src: 'img/icons/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: 'img/icons/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	},
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({ template: { transformAssetUrls } }),
		vuetify({ autoImport: true }),
		Components(),
		AutoImport({
			include: [
				/\.[tj]sx?$/,
				/\.vue$/,
				/\.vue\?vue/,
				/\.md$/,
			],
			imports: [
				'vue',
				'vue-router',
			],
			dts: 'src/auto-imports.d.ts',
			eslintrc: { enabled: true },
			dirs: ['src/store'],
			vueTemplate: false,
		}),
		Unfonts({
			custom: {
				families: [
					{
						name: 'B612 Mono',
						local: 'B612 Mono',
						src: './src/assets/fonts/*.woff2',
					},
					{
						name: 'Maven Pro',
						local: 'Maven Pro',
						src: './src/assets/fonts/*.woff2',
					},
				],
				display: 'auto',
				preload: true,
				injectTo: 'head-prepend',
			},

		}),
		VitePWA(pwaOptions),
		viteCompression({ algorithm: 'brotliCompress' }),
		viteCompression({ algorithm: 'gzip' }),

	],

	define: {
		'process.env': {},
		'import.meta.env.BUILD_DATE': Date.now(),
		'import.meta.env.VERSION': JSON.stringify(process.env.npm_package_version),
	},
	resolve: {
		alias: { '@': fileURLToPath(new URL('src', import.meta.url)) },
		extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
	},
	server: {
		port: 8002,
		host: '127.0.0.1',
	},
})
