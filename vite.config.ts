// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import type { VitePWAOptions } from 'vite-plugin-pwa';
import AutoImport from 'unplugin-auto-import/vite';
import { FontaineTransform } from 'fontaine';
import Components from 'unplugin-vue-components/vite';

// Utilities
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const fontaine_options = {
	fallbacks: [ 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans' ],
	resolvePath: (id: string): string => './src/assets/fonts' + id,
};

const pwaOptions: Partial<VitePWAOptions> = {
	base: '/',
	registerType: 'prompt',
	includeAssets: [ 'favicon.ico' ],
	workbox: {
		cleanupOutdatedCaches: true
	},
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
};

// https://vitejs.dev/config/
export default defineConfig(({ mode: _mode }) => {

	// const env = loadEnv(mode, process.cwd());

	return {
		plugins: [
			vue({
				template: { transformAssetUrls }
			}),
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
			vuetify({
				autoImport: true,
			}),
			Components(),
			AutoImport({
				include: [
					/\.[tj]sx?$/,
					/\.vue$/, /\.vue\?vue/,
					/\.md$/,
				],
				imports: [
					'vue',
					'vue-router',
				],
				dts: 'src/auto-imports.d.ts',
				eslintrc: {
					enabled: true,
				},
				dirs: [
					'src/store',
				],
				vueTemplate: false,
			}),
			FontaineTransform.vite(fontaine_options),
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
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
			extensions: [ '.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue' ],
		},
		server: {
			port: 8002,
			host: '127.0.0.1'
		},
	};
});
