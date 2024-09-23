"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const JoinTables_1 = require("../queryBuilder/JoinTables");
const getField_1 = __importDefault(require("./getField"));
const getOperator_1 = __importDefault(require("./getOperator"));
const UpdateFields_1 = require("../queryBuilder/UpdateFields");
const SelectFields_1 = require("../queryBuilder/SelectFields");
const WhereFilter_1 = require("../queryBuilder/WhereFilter");
const globalSetting_1 = require("../config/globalSetting");
const BasicQuery_1 = require("../queryBuilder/BasicQuery");
class Query {
    constructor(sqlObj, valNum = 0, token, userId) {
        this.toTable = (0, getField_1.default)("to", sqlObj);
        this.fields = (0, getField_1.default)("fields", sqlObj) || [];
        this.table = (0, getField_1.default)("from", sqlObj) || [];
        this.toFields = (0, getField_1.default)("fields", sqlObj) || [];
        this.setFields = (0, getField_1.default)("set", sqlObj) || [];
        this.join = (0, getField_1.default)("join", sqlObj) || [];
        this.where = (0, getField_1.default)("filter", sqlObj);
        this.group = (0, getField_1.default)("group", sqlObj) || [];
        this.order = (0, getField_1.default)("sort", sqlObj) || [];
        this.limit = (0, getField_1.default)("limit", sqlObj);
        this.offset = (0, getField_1.default)("page", sqlObj);
        this.values = [];
        this.num = valNum;
        this.token = token;
        this.userId = userId;
    }
    getValues() {
        return this.values;
    }
    getSelect() {
        const query = [];
        query.push(this.qSelect(this.fields));
        query.push(this.qFrom(this.table, this.join));
        query.push(this.qWhere(this.where));
        query.push(this.qGroup(this.group, this.fields));
        query.push(this.qOrder(this.order));
        query.push(this.qLimit(this.limit, this.offset));
        return query.filter((q) => q).join(Query.SQLSectionDelimiter);
    }
    getUpdate() {
        const query = [];
        const pTable = this.parseTable(this.toTable);
        query.push("UPDATE");
        query.push(pTable.table);
        query.push(this.qSet(this.setFields));
        const iWhere = this.qWhere(this.where);
        query.push(iWhere);
        const accessUpd = new BasicQuery_1.BasicQuery(0, this.token, this.userId);
        if (accessUpd.needCheckAccess(pTable.table)) {
            const sqlAcc = "id in (" + accessUpd.allowTableData(pTable.table, "id", 20) + ")";
            query.push(iWhere ? `AND ${sqlAcc}` : `WHERE  ${sqlAcc}`);
        }
        return query.filter((q) => q).join(Query.SQLSectionDelimiter);
    }
    getInsert() {
        const query = [];
        const pTable = this.parseTable(this.toTable);
        query.push("INSERT INTO");
        query.push(pTable.table);
        query.push(this.qInsert(this.toFields));
        query.push(this.qFrom(this.table, this.join));
        const iWhere = this.qWhere(this.where);
        query.push(iWhere);
        const accessIns = new BasicQuery_1.BasicQuery(0, this.token, this.userId);
        if (accessIns.needCheckAccess(pTable.table)) {
            const sqlAcc = "EXISTS (" + accessIns.allowTableData(pTable.table, "id", 10) + ")";
            query.push(iWhere ? `AND ${sqlAcc}` : `WHERE  ${sqlAcc}`);
        }
        return query.filter((q) => q).join(Query.SQLSectionDelimiter);
    }
    getDelete() {
        const query = [];
        const pTable = this.parseTable(String(this.table));
        query.push("DELETE FROM");
        query.push(pTable.table);
        const iWhere = this.qWhere(this.where);
        query.push(iWhere);
        const accessUpd = new BasicQuery_1.BasicQuery(0, this.token, this.userId);
        if (accessUpd.needCheckAccess(pTable.table)) {
            const sqlAcc = "id in (" + accessUpd.allowTableData(pTable.table, "id", 30) + ")";
            query.push(iWhere ? `AND ${sqlAcc}` : `WHERE  ${sqlAcc}`);
        }
        return query.filter((q) => q).join(Query.SQLSectionDelimiter);
    }
    qInsert(fields) {
        let query = "(";
        if (fields) {
            let num = 0;
            const fieldList = [];
            const valueList = [];
            for (const key in fields) {
                let value = "";
                if (Object.hasOwnProperty.call(fields, key)) {
                    num++;
                    fieldList.push(`"${key}"`);
                    valueList.push("$" + num);
                    value = (0, getOperator_1.default)(fields[key], this.userId)[1];
                    this.values.push(value);
                }
            }
            query += fieldList.join(", ") + ")";
            query += "\nSELECT " + valueList.join(", ") + "";
        }
        return query;
    }
    parseTable(tbl) {
        let table = tbl;
        let scheme = globalSetting_1.defaultSchema;
        const sp = table.split(".");
        if (sp.length === 2) {
            scheme = sp[0];
            table = sp[1];
        }
        return {
            table: scheme + "." + table,
        };
    }
    qFrom(tables, join) {
        let tableArray = [];
        tableArray = tableArray.concat(tables);
        const from = new JoinTables_1.JoinTables(tableArray, join, this.num + this.values.length, this.token, this.userId);
        this.values = this.values.concat(from.getValues());
        return from.toString();
    }
    qSet(fields) {
        const set = new UpdateFields_1.UpdateFields(fields, this.num + this.values.length, this.token, this.userId);
        this.values = this.values.concat(set.getValues());
        return set.toString();
    }
    qSelect(fields) {
        const select = new SelectFields_1.SelectFields(fields, this.num + this.values.length, this.token, this.userId);
        this.values = this.values.concat(select.getValues());
        return select.toString();
    }
    qWhere(wheres) {
        const where = new WhereFilter_1.WhereFilter(wheres, this.num + this.values.length, this.token, this.userId);
        this.values = this.values.concat(where.getValues());
        return where.toString();
    }
    qOrder(order) {
        const query = [];
        order.forEach((e) => {
            let by = " ASC";
            const sp = e.split("-");
            if (sp.length > 1) {
                by = " DESC";
                e = sp[1];
            }
            query.push(e + by);
        });
        if (query.length === 0) {
            return "";
        }
        return "ORDER BY " + query.join(", ");
    }
    qGroup(group, fields) {
        const query = [];
        let checkSelectFielsd = true;
        group.forEach((e) => {
            if (fields.find((f) => {
                let res = false;
                if (typeof f === "string") {
                    res = f.includes(e);
                }
                return res;
            })) {
                query.push(e);
            }
            else {
                checkSelectFielsd = false;
            }
        });
        if (query.length === 0 || !checkSelectFielsd) {
            return "";
        }
        return "GROUP BY " + query.join(", ");
    }
    qLimit(limit, offset) {
        let query = [];
        // ограничение выдаваемых записей
        if (limit) {
            query.push("LIMIT " + limit);
        }
        if (offset && limit) {
            offset = (offset - 1) * limit;
            if (offset > 0) {
                query.push("OFFSET " + offset);
            }
        }
        return query.join(Query.SQLSectionDelimiter);
    }
}
exports.Query = Query;
Query.SQLSectionDelimiter = "\n";
