import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
      eqeqeq: "error",
      "prefer-const": "error",
      "object-shorthand": "error",
      "no-var": "error",
      curly: ["error", "all"],
    },
  },
  prettierConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "auth-private.pem",
    "auth-public.pem",
  ]),
]);

export default eslintConfig;
