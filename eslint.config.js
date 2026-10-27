import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/", "dist/", "build/", "coverage/", "*.min.js"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.mjs", "tests/**/*.mjs", "*.mjs", "*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-console": "error",
    },
  },
];
