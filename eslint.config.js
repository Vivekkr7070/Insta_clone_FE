import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],

    languageOptions: {
      globals: globals.browser,
    },

    settings: {
      react: {
        version: "detect", // Automatically detects React version from node_modules
      },
    },

    plugins: {
      react: pluginReact,
      "react-hooks": reactHooks,
    },

    rules: {
      ...pluginJs.configs.recommended.rules, // Base JavaScript rules
      ...tseslint.configs.recommended.rules, // TypeScript rules
      ...pluginReact.configs.flat.recommended.rules, // React rules

      // React hooks rules
      "react-hooks/rules-of-hooks": "error", // Enforces rules of hooks
      "react-hooks/exhaustive-deps": "warn", // Warns about missing dependencies
    },
  },
];