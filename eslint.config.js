import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
    eslintConfigPrettier,
    {
        languageOptions: {
            globals: globals.node,
            ecmaVersion: 2021,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        ignores: ["node_modules", ".github", ".vscode", "coverage"],
    },
    pluginJs.configs.recommended,
];
