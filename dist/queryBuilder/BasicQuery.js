"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicQuery = void 0;
const globalSetting_1 = require("@/config/globalSetting");
const queryConst_1 = require("./queryConst");
const classQuery_1 = __importDefault(require("@/creators/classQuery"));
class BasicQuery {
    constructor(valNum = 0, token, user_id) {
        this.values = [];
        this.queryString = "";
        this.userId = "";
        this.valNum = 0;
        this.token = "";
        this.userId = user_id;
        this.valNum = valNum;
        this.token = token;
    }
    getValues() {
        return this.values;
    }
    prepareField(fieldValue) {
        // разделяем строку по двоеточиям
        let splitted = fieldValue.split(":");
        if (splitted.indexOf("") === 1) {
            // если нашли пустую строку, значит это тип переменной для поля
            splitted[2] = splitted[0] + "::" + splitted[2];
            splitted = splitted.slice(2);
        }
        return splitted.join(" AS ");
    }
    splitTable(table) {
        const splitT = table.split(".");
        let scheme = globalSetting_1.defaultSchema;
        if (splitT.length === 2) {
            scheme = splitT[0];
            table = splitT[1];
        }
        return {
            scheme,
            table,
        };
    }
    parseParameter(parameterString) {
        let field;
        let operator = "=";
        let type = "";
        let value;
        if (typeof parameterString !== "string" || !parameterString.includes(":")) {
            value = parameterString;
        }
        else {
            if (parameterString.includes("::")) {
                // находим указание типов
                const typesString = parameterString.split("::");
                for (let index = typesString.length - 1; index > 0; index--) {
                    const testType = typesString[index];
                    if (queryConst_1.postgresTypes.includes(testType)) {
                        type = "::" + testType + type;
                        typesString.pop();
                    }
                    else {
                        break;
                    }
                }
                // обратно склеиваем оставшийся массив в строку
                parameterString = typesString.join("::");
            }
            const splitParameters = parameterString.split(":");
            const testOperator = splitParameters[0];
            if (queryConst_1.allowOperators.includes(testOperator)) {
                if (testOperator.indexOf("@@") === 0) {
                    // имя поля в качестве значения
                    field = splitParameters[1];
                    // проверяем наличие оператора для сравнения
                    const fieldOperator = testOperator.substring(2);
                    // изменяем оператор, если он указывался для сравнения
                    if (fieldOperator)
                        operator = fieldOperator;
                }
                else {
                    operator = testOperator;
                }
                splitParameters.shift();
            }
            value = splitParameters.join(":");
        }
        return {
            operator,
            field,
            value,
            type,
        };
    }
    changeParameterValue(parameter) {
        // проверяем предопределенные глобальные переменные
        switch (parameter.value) {
            case "${currentUser}":
                parameter.value = this.userId;
                break;
            case "${currentTimestamp}":
                parameter.value = new Date().toISOString();
                break;
            case "null":
                parameter.value = null;
                break;
            default:
                break;
        }
        return Object.assign({}, parameter);
    }
    subQuery(restTable) {
        const childSQL = new classQuery_1.default(restTable, this.valNum + this.values.length, this.token, this.userId);
        const cSelect = childSQL.getSelect();
        this.values = this.values.concat(childSQL.getValues());
        return cSelect;
    }
}
exports.BasicQuery = BasicQuery;
