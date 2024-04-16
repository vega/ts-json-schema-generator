import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type {import('@types/eslint').Linter.FlatConfig[]} */
export default tseslint.config(
    {
        ignores: ["dist"],
    },
    eslint.configs.recommended,
    {
        files: [
            "ts-json-schema-generator.ts",
            "index.ts",
            "src/**/*.ts",
            "factory/**/*.ts",
            "bin/**",
            "test/**/*.test.ts",
            "test/utils.ts",
        ],
        extends: tseslint.configs.recommendedTypeChecked,
        languageOptions: {
            sourceType: "module",
            parserOptions: {
                project: "tsconfig.eslint.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-parameter-properties": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    args: "none",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/no-object-literal-type-assertion": "off",
            "@typescript-eslint/no-namespace": "error",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
            "@typescript-eslint/no-unsafe-return": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn",
            "@typescript-eslint/no-unsafe-call": "warn",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/no-unnecessary-type-assertion": "warn",
            "no-alert": "error",
            "prefer-const": "error",
            "no-return-assign": "error",
            "no-useless-call": "error",
            "no-shadow": "error",
            "no-useless-concat": "error",
            "no-undef": "off",
            "no-prototype-builtins": "off",
        },
    },
    {
        files: ["*.js"],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        files: ["test/**/*.test.ts"],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
    eslintPluginPrettierRecommended
);
