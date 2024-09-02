"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFields = void 0;
const BasicQuery_1 = require("./BasicQuery");
class UpdateFields extends BasicQuery_1.BasicQuery {
    constructor(set, valNum = 0, token, userId) {
        super(valNum, token, userId);
        this.fields = [];
        let test = 0;
        for (const key in set) {
            if (Object.prototype.hasOwnProperty.call(set, key)) {
                const element = set[key];
                if (typeof element === "string" ||
                    typeof element === "boolean" ||
                    typeof element === "number" ||
                    element === null ||
                    Array.isArray(element)) {
                    const parsedField = this.changeParameterValue(this.parseParameter(element));
                    const arrParam = [];
                    arrParam.push(`"${key}"`);
                    arrParam.push("=");
                    const currentParamNum = this.valNum + this.values.length + 1;
                    arrParam.push((parsedField.field || "$" + currentParamNum) + parsedField.type);
                    if (!parsedField.field) {
                        this.values.push(parsedField.value);
                    }
                    this.fields.push(arrParam.join(" "));
                }
                else if (Object.prototype.toString.call(element) === "[object Object]") {
                    const cSelect = this.subQuery(element);
                    const arrParam = [];
                    arrParam.push(`"${key}"`);
                    arrParam.push("=");
                    arrParam.push(`(${cSelect})`);
                    this.fields.push(arrParam.join(" "));
                }
                test++;
            }
        }
        if (test === 0) {
            return;
        }
        this.queryString = "SET ";
    }
    toString() {
        return this.queryString + this.fields.join(", ");
    }
}
exports.UpdateFields = UpdateFields;
