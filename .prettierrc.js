/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    trailingComma: "es5",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    endOfLine: "lf",
    overrides: [
        {
            files: ["*.json", "*.yaml", "*.yml", "*.md"],
            options: {
                tabWidth: 2,
            },
        },
    ],
    plugins: ["@ianvs/prettier-plugin-sort-imports"],
    importOrder: [
        "^express$",
        "^dotenv$",
        "<BUILTIN_MODULES>",
        "<THIRD_PARTY_MODULES>",
        "^[./].*middleware\\.js$",
        "^[./].*controllers\\.js$",
        "^[./].*routes\\.js$",
        "^[./].*services\\.js$",
        "^[./]*utils/.*$",
        "^[./].*validators\\.js$",
        "^[./].*db\\.js$",
        "^[./].*logger\\.js$",
        "^[./]",
    ],
};

export default config;
