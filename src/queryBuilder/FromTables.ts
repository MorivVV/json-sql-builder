import { IRestGet } from "../types/restApi";
import { BasicQuery } from "./BasicQuery";
import { defaultSchema } from "../config/globalSetting";
interface ITableList {
  table: string;
  alias: string;
  use: boolean;
}
export class FromTables extends BasicQuery {
  tables: ITableList[] = [];
  /**По умолчанию все таблицы проверяются на доступ
   * можно исключить проверку через этот массив на схемы
   */
  static accessTable: string[] = [];
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
    if (!FromTables.accessTable.includes(pTable.scheme)) {
      pTable.table = this.addAccess(pTable.table);
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

  private addAccess(table: string) {
    return `(SELECT *
    FROM ${table} AS t
    WHERE 
    NOT EXISTS (SELECT 1 FROM ${defaultSchema}.rights_table as rt WHERE rt.naimen = '${table}' AND rt.active=true)
    OR EXISTS (SELECT 1 FROM ${defaultSchema}.roles as r 
      INNER JOIN ${defaultSchema}.roles_users as ru ON r.id = ru.kod_role 
      INNER JOIN ${defaultSchema}.bz_users as u ON ru.kod_user = u.id
      INNER JOIN ${defaultSchema}.bz_user_tokens as ut ON u.id = ut.kod_user
      WHERE ut.session_token = '${this.token}' 
      AND r.full_access = true
      AND u.active = true
      AND ut.active = true
      LIMIT 1)
    OR t.id in 
    (
      SELECT table_identificator 
      FROM ${defaultSchema}.rights_elements as re
        INNER JOIN ${defaultSchema}.rights_table as rt ON re.kod_table = rt.id 
        INNER JOIN ${defaultSchema}.roles as r ON re.kod_role = r.id 
        INNER JOIN ${defaultSchema}.roles_users as ru ON r.id = ru.kod_role 
        INNER JOIN ${defaultSchema}.bz_users as u ON ru.kod_user = u.id
        INNER JOIN ${defaultSchema}.bz_user_tokens as ut ON u.id = ut.kod_user
      WHERE rt.naimen = '${table}'
        AND ut.session_token = '${this.token}'
        AND u.active = true
        AND ut.active = true
    ) )`;
  }
}
