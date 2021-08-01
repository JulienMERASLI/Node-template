/* eslint-disable import/no-extraneous-dependencies */

import { UserConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

const config: UserConfig = {
	plugins: [reactRefresh()],
	esbuild: {
		jsxInject: "import { h, Fragment } from 'preact'",
		jsxFactory: "h",
		jsxFragment: "Fragment",
	},
	build: {
		minify: false,

	},
	resolve: {
		alias: {
			react: "preact/compat",
			"react-dom": "preact/compat",
		},
	},
	server: {
		fs: {
			allow: ["."],
		},
	},
};
export default config;
