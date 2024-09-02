"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparator = void 0;
const comparator = (field) => {
    var len = 0;
    var fields, orders;
    if (typeof field === "object") {
        fields = Object.getOwnPropertyNames(field);
        orders = fields.map((key) => field[key]);
        len = fields.length;
    }
    return (a, b) => {
        for (let i = 0; i < len; i++) {
            if (a[fields[i]] < b[fields[i]])
                return -orders[i];
            if (a[fields[i]] > b[fields[i]])
                return orders[i];
        }
        return 0;
    };
};
exports.comparator = comparator;
