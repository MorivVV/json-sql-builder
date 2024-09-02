import { IRestGet } from "../types/restApi";
import { FromTables } from "./FromTables";
interface ITableList {
  table: string;
  alias: string;
  use: boolean;
}
interface IJoin {
  firstTableAlias: string;
  firstField: string;
  isJoin: string;
  secondTableAlias: string;
  secondField: string;
}
export class JoinTables extends FromTables {
  private joinString = "";
  constructor(tables: Array<string | IRestGet>, joins: string[] = [], valNum = 0, token: string, userId: string) {
    super(tables, valNum, token, userId);
    let query = "";
    const joinList: IJoin[] = [];
    for (let index = 0; index < joins.length; index++) {
      const join = joins[index];
      joinList.push(this.parseJoinFields(join));
    }
    for (let index = 0; index < joinList.length; index++) {
      const joinObj = joinList[index];
      const table1 = this.tables.filter((t) => t.alias === joinObj.firstTableAlias)[0];
      const table2 = this.tables.filter((t) => t.alias === joinObj.secondTableAlias)[0];
      if (index === 0) {
        table1.use = true;
        table2.use = true;
        query = this.tableAsAlias(table1.table, table1.alias);
        query += this.joinTable(table2, joinObj);
      } else if (
        joinList[index - 1].firstTableAlias === joinObj.firstTableAlias &&
        joinList[index - 1].secondTableAlias === joinObj.secondTableAlias
      ) {
        query += "\n\tAND ";
        query += this.joinFields(joinObj);
      } else {
        if (!table1.use) {
          table1.use = true;
          query += this.joinTable(table1, joinObj);
        } else if (!table2.use) {
          table2.use = true;
          query += this.joinTable(table2, joinObj);
        } else {
          query += "\n\tAND ";
          query += this.joinFields(joinObj);
        }
      }
    }

    this.joinString = query;
  }

  private joinTable(table2: ITableList, joinObj: IJoin) {
    let query = joinObj.isJoin + " ";
    query += this.tableAsAlias(table2.table, table2.alias);
    query += "\n\tON ";
    query += this.joinFields(joinObj);
    return query;
  }

  private joinFields(joinObj: IJoin) {
    let query = joinObj.firstTableAlias + "." + joinObj.firstField;
    query += " = ";
    query += joinObj.secondTableAlias + "." + joinObj.secondField;
    return query;
  }

  private tableAsAlias(table: string, alias = "") {
    const tableAlias: string[] = [];
    tableAlias.push(table);
    if (alias) {
      tableAlias.push(alias);
    }
    return tableAlias.join(" AS ");
  }

  private parseJoinFields(join: string) {
    const sp = join.split("=");
    const key = sp[0];
    const element = sp[1];
    const { scheme: firstTableAlias, table: firstField } = this.splitTable(key);
    const isJoin = this.makeJoin(element);
    const { scheme: secondTableAlias, table: secondField } = this.splitTable(element.replace("(+)", ""));
    return { firstTableAlias, firstField, isJoin, secondTableAlias, secondField };
  }

  private makeJoin(element: string) {
    let isJoin = "\n";
    switch (element.indexOf("(+)")) {
      case -1:
        isJoin += "INNER JOIN";
        break;
      case 0:
        isJoin += "LEFT JOIN";
        break;
      default:
        isJoin += "RIGHT JOIN";
        break;
    }
    return isJoin;
  }

  toString() {
    const joinStr: string[] = [];
    if (this.joinString) joinStr.push(this.joinString);
    joinStr.push(...this.tables.filter((t) => t.use === false).map((t) => this.tableAsAlias(t.table, t.alias)));
    return this.queryString + joinStr.join(", ");
  }
}
