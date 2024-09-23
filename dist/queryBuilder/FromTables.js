"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromTables = void 0;
const BasicQuery_1 = require("./BasicQuery");
class FromTables extends BasicQuery_1.BasicQuery {
    constructor(tables, valNum = 0, token, userId) {
        super(valNum, token, userId);
        this.tables = [];
        for (let index = 0; index < tables.length; index++) {
            const table = tables[index];
            let pTable;
            let alias = "at" + index;
            const use = false;
            if (typeof table === "string") {
                // вытаскиваем значения из функции
                ({ pTable, alias } = this.stringTable(table, index));
            }
            else {
                ({ pTable, alias } = this._subQuery(table));
            }
            this.tables.push(Object.assign(Object.assign({}, pTable), { alias, use }));
            if (index === 0)
                this.queryString = "FROM ";
        }
    }
    stringTable(strTable, ind = 0) {
        const sp = strTable.split(":");
        const table = sp[0];
        let alias = "at" + ind;
        if (sp.length === 2) {
            alias = sp[1];
        }
        const pTable = this.splitTable(table);
        pTable.table = pTable.scheme + "." + pTable.table;
        if (this.needCheckAccess(pTable.table)) {
            pTable.table = `(${this.allowTableData(pTable.table)})`;
        }
        return { pTable, alias };
    }
    _subQuery(t) {
        const cSelect = super.subQuery(t);
        let alias = "t0";
        const pTable = {
            table: "(" + cSelect + ")",
        };
        if ("alias" in t && t.alias) {
            alias = t.alias;
        }
        else {
            alias = "t" + this.valNum;
        }
        return { pTable, alias };
    }
}
exports.FromTables = FromTables;
