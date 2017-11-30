module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-case-declarations": 0,
        "no-unreachable": 0,
        "no-empty": 0,
        "no-debugger": 0,
        "no-console": 1,
        "no-unused-vars": 1,
        "no-var": 2,
        // "jsx-a11y/href-no-hash": 0,
        "no-tabs": 0,
        "radix": 0,
        "no-plusplus": 0,
        "eqeqeq": 1,
        "no-shadow": 1,
        "no-mixed-operators": 1,
        "no-mixed-operators": [
            "error",
            {
                "allowSamePrecedence": true
            }
        ],
        "max-len": [
            "error",
            80
        ],
        "no-bitwise": [
            "error",
            {
                "int32Hint": true
            }
        ],
        "no-param-reassign": 1,
        "no-nested-ternary": 0,
        "no-useless-return": 0,
        "no-unused-expressions": 1,
        // "linebreak-style": 0,
        "class-methods-use-this": 0,
        "import/no-extraneous-dependencies": 1
    }
};