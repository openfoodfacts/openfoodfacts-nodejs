import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default tseslint.config(
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...eslint.configs.recommended.rules, // Include recommended JS rules
      ...tseslint.configs.recommended.rules, // Include recommended TS rules
    },
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
  },
  {
    // Global ignore patterns
    ignores: [
      "dist",
      "docs",
      ".yarn",
      "node_modules",
      "**/node_modules",
      "src/schemas",
      "coverage",
      "*.config.mjs",
      "jest.config.ts",
    ],
  },
);
