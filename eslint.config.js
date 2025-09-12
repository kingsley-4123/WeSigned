import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["eslint:recommended", "plugin:prettier/recommended"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
]);
