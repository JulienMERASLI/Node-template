module.exports = {
	root: "public",
	exclude: ["**/(styles|fonts|images)/*"],
	buildOptions: {
		jsxInject: "import { h, Fragment } from \"preact\"",
	},
	plugins: [
		[
			"@snowpack/plugin-typescript",
		]
	],
	packageOptions: {
		polyfillNode: true,
		knownEntrypoints: ["preact"]
	}
};
