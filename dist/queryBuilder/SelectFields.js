"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectFields = void 0;
const BasicQuery_1 = require("./BasicQuery");
class SelectFields extends BasicQuery_1.BasicQuery {
    constructor(fields, valNum = 0, token, userId) {
        super(valNum, token, userId);
        this.fields = [];
        this.queryString = "SELECT ";
        if (!fields || fields.length === 0) {
            this.fields.push("*");
            return;
        }
        for (let index = 0; index < fields.length; index++) {
            const element = fields[index];
            if (typeof element === "string") {
                const parsedField = this.prepareField(element);
                if (index === 0 && parsedField === "DISTINCT") {
                    this.queryString += "DISTINCT ";
                }
                else {
                    this.fields.push(parsedField);
                }
            }
            else if (Object.prototype.toString.call(element) === "[object Object]") {
                const cSelect = this.subQuery(element);
                this.fields.push(`(${cSelect})`);
            }
        }
    }
    toString() {
        return this.queryString + this.fields.join("\n, ");
    }
}
exports.SelectFields = SelectFields;
