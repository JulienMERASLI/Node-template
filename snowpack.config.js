module.exports = {
	root: "public/scripts",
	buildOptions: {
		jsxInject: "import React from \"dom-chef\"",
	},
	plugins: [
		[
			"@snowpack/plugin-typescript",
		]
	],
	packageOptions: {
		polyfillNode: true,
		knownEntrypoints: ["dom-chef"]
	}
};
