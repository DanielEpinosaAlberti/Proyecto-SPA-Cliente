import js from "@eslint/js";
import globals from "globals";

export default [
  {
    // Carpetas generadas o dependencias que no deben revisarse.
    ignores: ["node_modules/", "coverage/", "dist/"],
  },
  js.configs.recommended,
  {
    // Código de la SPA: módulos ES que se ejecutan en el navegador.
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.builtin,
      },
    },
    rules: {
      // Avisa de variables/importaciones sin usar, pero permite prefijar con _.
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Los console.error del proyecto son intencionados para depuración.
      "no-console": "off",
      // El catch vacío de validacion.js es intencionado: se ignora un patrón
      // inválido del HTML sin bloquear el formulario.
      "no-empty": ["error", { allowEmptyCatch: true }],
      // Comparaciones estrictas y declaraciones modernas.
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
    },
  },
  {
    // El propio archivo de configuración se ejecuta en Node.
    files: ["eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.builtin,
      },
    },
  },
];
