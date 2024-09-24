import { IRestGet } from "../types/restApi";
import { BasicQuery } from "./BasicQuery";
interface ITableList {
  table: string;
  alias: string;
  use: boolean;
}
export class FromTables extends BasicQuery {
  tables: ITableList[] = [];

  constructor(
    tables: Array<string | IRestGet>,
    valNum = 0,
    token: string,
    userId: string
  ) {
    super(valNum, token, userId);
    for (let index = 0; index < tables.length; index++) {
      const table = tables[index];
      let pTable: { table: string };
      let alias = "at" + index;
      const use = false;
      if (typeof table === "string") {
        // вытаскиваем значения из функции
        ({ pTable, alias } = this.stringTable(table, index));
      } else {
        ({ pTable, alias } = this._subQuery(table));
      }
      this.tables.push({ ...pTable, alias, use });
      if (index === 0) this.queryString = "FROM ";
    }
  }

  private stringTable(strTable: string, ind = 0) {
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

  private _subQuery(t: IRestGet) {
    const cSelect = super.subQuery(t);
    let alias = "t0";
    const pTable = {
      table: "(" + cSelect + ")",
    };
    if ("alias" in t && t.alias) {
      alias = t.alias;
    } else {
      alias = "t" + this.valNum;
    }
    return { pTable, alias };
  }
}
