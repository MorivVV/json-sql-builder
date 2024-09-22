"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicQuery = void 0;
const queryConst_1 = require("./queryConst");
const globalSetting_1 = require("../config/globalSetting");
const classQuery_1 = require("../creators/classQuery");
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
        const childSQL = new classQuery_1.Query(restTable, this.valNum + this.values.length, this.token, this.userId);
        const cSelect = childSQL.getSelect();
        this.values = this.values.concat(childSQL.getValues());
        return cSelect;
    }
    needCheckAccess(table) {
        const tableSplit = this.splitTable(table);
        if (BasicQuery.forcedAccessTables.includes(table)) {
            return true;
        }
        else if (!BasicQuery.notAccessShemeOrTable.includes(tableSplit.scheme) &&
            !BasicQuery.notAccessShemeOrTable.includes(table)) {
            return true;
        }
        else {
            return false;
        }
    }
    allowTableData(table) {
        return `SELECT table_identificator 
      FROM ${globalSetting_1.defaultSchema}.rights_elements as re
        INNER JOIN ${globalSetting_1.defaultSchema}.rights_table as rt ON re.kod_table = rt.id 
        INNER JOIN ${globalSetting_1.defaultSchema}.roles as r ON re.kod_role = r.id 
        INNER JOIN ${globalSetting_1.defaultSchema}.roles_users as ru ON r.id = ru.kod_role 
        INNER JOIN ${globalSetting_1.defaultSchema}.bz_users as u ON ru.kod_user = u.id
        INNER JOIN ${globalSetting_1.defaultSchema}.bz_user_tokens as ut ON u.id = ut.kod_user
      WHERE rt.naimen = '${table}'
        AND ut.session_token = '${this.token}'
        AND u.active = true
        AND ut.active = true`;
    }
}
exports.BasicQuery = BasicQuery;
/**По умолчанию все таблицы проверяются на доступ
 * можно исключить проверку через этот массив на схемы
 */
BasicQuery.notAccessShemeOrTable = [];
/**Принудительная проверка таблиц
 * на все таблицы, указанные в этом массиве будет наложена проверка доступа, даже если они исключены
 */
BasicQuery.forcedAccessTables = [];
