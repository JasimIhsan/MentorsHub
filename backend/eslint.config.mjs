import tseslint from "typescript-eslint";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{ts,js}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			"unused-imports": eslintPluginUnusedImports,
		},
		rules: {
			// ❌ Show error for unused imports
			"unused-imports/no-unused-imports": "error",

			// ⚠️ Warn for unused variables (but ignore ones starting with "_")
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],

			// Disable base rule
			"no-unused-vars": "off",
			"no-console": [
				"warn",
				{
					allow: ["warn", "error"], // allow console.warn and console.error
				},
			],

			semi: ["error", "always"],
			quotes: ["error", "double"],
			"comma-dangle": ["error", "always-multiline"],
			"object-curly-spacing": ["error", "always"],
		},
	},
]);
