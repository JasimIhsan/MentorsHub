import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		languageOptions: {
			globals: globals.browser,
		},
		extends: [
			...tseslint.configs.recommended,
			pluginReact.configs.flat.recommended,
			pluginReact.configs.flat["jsx-runtime"], // ✅ fixes "React must be in scope"
		],
		plugins: {
			"react-hooks": reactHooks,
			"jsx-a11y": jsxA11y,
		},
		rules: {
			"react/react-in-jsx-scope": "off", // not needed in React 17+
			"react/prop-types": "off", // disable if using TS
			"react-hooks/rules-of-hooks": "error", // enforce hook rules
			"react-hooks/exhaustive-deps": "warn", // check effect deps
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
]);
