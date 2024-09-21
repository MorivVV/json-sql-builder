"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereFilter = void 0;
const BasicQuery_1 = require("./BasicQuery");
class WhereFilter extends BasicQuery_1.BasicQuery {
    constructor(wheres, valNum = 0, token, userId) {
        super(valNum, token, userId);
        let ArrWhere = [];
        ArrWhere = ArrWhere.concat(wheres);
        // console.log("вход значения", valNum);
        this.queryString = this.whereOr(ArrWhere);
    }
    changeParameterValue(parameter) {
        parameter = super.changeParameterValue(parameter);
        switch (parameter.value) {
            case null:
                parameter.value = null;
                parameter.operator = "IS";
                parameter.field = "NULL";
                break;
            case "!null":
                parameter.value = null;
                parameter.operator = "IS";
                parameter.field = "NOT NULL";
                break;
            default:
                break;
        }
        return Object.assign({}, parameter);
    }
    intepretatedField(field) {
        const key = field.replace(/@\d+/, "");
        return key;
    }
    subQueryOperator(key, subQuery) {
        const field = this.intepretatedField(key);
        let query = "";
        switch (field) {
            case "EXISTS":
                query = `EXISTS (${subQuery})`;
                break;
            case "NOT_EXISTS":
                query = `NOT EXISTS (${subQuery})`;
                break;
            default:
                query = `${field} in (${subQuery})`;
                break;
        }
        return query;
    }
    whereAnd(object) {
        const query = [];
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                if (Array.isArray(element)) {
                    query.push("(" + this.whereOr(element) + ")");
                }
                else if (Object.prototype.toString.call(element) === "[object Object]") {
                    const cSelect = this.subQuery(element);
                    query.push(this.subQueryOperator(key, cSelect));
                }
                else {
                    const parseWhereValue = this.changeParameterValue(this.parseParameter(element));
                    const arrParam = [];
                    arrParam.push(this.intepretatedField(key));
                    arrParam.push(parseWhereValue.operator);
                    const currentParamNum = this.valNum + this.values.length + 1;
                    arrParam.push((parseWhereValue.field || "$" + currentParamNum) +
                        parseWhereValue.type);
                    if (!parseWhereValue.field) {
                        this.values.push(parseWhereValue.value);
                    }
                    query.push(arrParam.join(" "));
                    // console.log(parseWhereValue);
                }
                // console.log("цикл значения", this.valNum);
            }
        }
        return query.join("\nAND ");
    }
    whereOr(array) {
        const query = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const w = this.whereAnd(element);
            if (w)
                query.push(`(${w})`);
        }
        return query.join("\n OR ");
    }
    toString() {
        // console.log(this.queryString, this.values);
        return this.queryString ? "WHERE " + this.queryString : "";
    }
}
exports.WhereFilter = WhereFilter;
