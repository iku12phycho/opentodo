"use strict";
module.exports = {
    "root": [
        "<rootDir>/src"
    ],
    "testMatch": [
        "**/__test__/**/*.+(ts|js|pug)",
        "**/?(*.)+(spec|test).+(ts|js|pug)"
    ],
    "transform": {
        "^.+\\.(ts)$": "ts-jest"
    }
};
