module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  "parserOptions": {
    tsconfigRootDir: __dirname,
    "project": ["./tsconfig.json"],
    "ecmaFeatures": {
      "jsx": true,
      "tsx": true
    },
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "env": {
    "browser": true
  },
  "plugins": [
    "import",
    "react",
    "@typescript-eslint",
    "sonarjs"
  ],
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:sonarjs/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "ignorePatterns": [
    "*.js",
    "*.d.ts"
  ],

  "rules": {
    "sonarjs/cognitive-complexity": 0,
    "sonarjs/no-nested-template-literals": 0,
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/semi": [
      "error",
      "never"
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/comma-dangle": 0,
    "@typescript-eslint/no-empty-function": 0,
    "react/prop-types": 0,
    "react/display-name": 0,
    "react/require-default-props": 0,
    "react/jsx-props-no-spreading": 0,
    "react/state-in-constructor": [
      2,
      "never"
    ],
    "import/no-extraneous-dependencies": 0,
    "no-nested-ternary": 0,
    "max-len": [
      "error",
      {
        "code": 244,
        "tabWidth": 2
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],

    "indent": [
      'error',
      2,
      {
        "SwitchCase": 1,
        "ignoredNodes": ['ConditionalExpression']
      }
    ],
    "no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-multi-spaces": [
      "error",
      {
        "ignoreEOLComments": false
      }
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 2,
        "maxEOF": 0
      }
    ],
  }
}