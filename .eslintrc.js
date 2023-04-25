module.exports = {
    parserOptions: {
        ecmaVersion: "latest",
    },
    env: {
        browser: false,
        node: true,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
};
