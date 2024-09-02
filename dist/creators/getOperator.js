"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryConst_1 = require("@/queryBuilder/queryConst");
const getOperator = (param, user_id) => {
    if (!isNaN(param) && !Array.isArray(param)) {
        param = "" + param;
    }
    const sp = [param];
    const splitter = param.indexOf(":");
    if (splitter > 0 && splitter < 5) {
        sp[0] = param.substr(0, splitter);
        sp[1] = param.substr(splitter + 1);
    }
    let operator = " = ";
    let value;
    if (sp.length === 1) {
        value = sp[0];
    }
    else if (queryConst_1.allowOperators.includes(sp[0])) {
        operator = " " + sp[0] + " ";
        value = sp[1];
    }
    else {
        value = param;
    }
    // проверяем предопределенные глобальные переменные
    switch (value) {
        case "${currentUser}":
            value = user_id;
            break;
        case "${currentTimestamp}":
            value = new Date().toISOString();
            break;
        case "null":
            value = null;
            break;
        default:
            break;
    }
    return [operator, value];
};
exports.default = getOperator;
