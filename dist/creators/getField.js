"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getField = (param, object) => {
    if (param in object) {
        return object[param];
    }
    else {
        return null;
    }
};
exports.default = getField;
