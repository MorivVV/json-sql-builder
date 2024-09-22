import { JoinTables } from "../queryBuilder/JoinTables";
import getField from "./getField";
import getOperator from "./getOperator";
import type {
  IrestDelete,
  IRestGet,
  IrestInsert,
  IrestUpdate,
} from "../types/restApi";
import { UpdateFields } from "../queryBuilder/UpdateFields";
import { SelectFields } from "../queryBuilder/SelectFields";
import { WhereFilter } from "../queryBuilder/WhereFilter";
import { defaultSchema } from "../config/globalSetting";
import { BasicQuery } from "../queryBuilder/BasicQuery";

export class Query<
  Fields extends string = string,
  _TBDALLTABLES extends string = string
> {
  static SQLSectionDelimiter = "\n";
  private toTable: string;
  private fields: string[];
  private table: string[];
  private toFields: string[];
  private setFields: {
    [key: string]:
      | string
      | number
      | boolean
      | Array<string | number | boolean>
      | IRestGet<Fields, _TBDALLTABLES>
      | null;
  };
  private join: string[];
  private where: string[];
  private group: string[];
  private order: string[];
  private limit: number;
  private offset: number;
  private num: number;
  private values: Array<
    | string
    // | IRestGet<Fields, _TBDALLTABLES>
    | number
    | boolean
    | null
    | Array<string | number | boolean>
  >;
  private token: string;
  private userId: string;

  constructor(
    sqlObj:
      | IRestGet<Fields, _TBDALLTABLES>
      | IrestUpdate
      | IrestDelete
      | IrestInsert,
    valNum = 0,
    token: string,
    userId: string
  ) {
    this.toTable = getField("to", sqlObj);
    this.fields = getField("fields", sqlObj) || [];
    this.table = getField("from", sqlObj) || [];
    this.toFields = getField("fields", sqlObj) || [];
    this.setFields = getField("set", sqlObj) || [];
    this.join = getField("join", sqlObj) || [];
    this.where = getField("filter", sqlObj);
    this.group = getField("group", sqlObj) || [];
    this.order = getField("sort", sqlObj) || [];
    this.limit = getField("limit", sqlObj);
    this.offset = getField("page", sqlObj);
    this.values = [];
    this.num = valNum;
    this.token = token;
    this.userId = userId;
  }

  getValues() {
    return this.values;
  }

  getSelect() {
    const query: string[] = [];
    query.push(this.qSelect(this.fields));
    query.push(this.qFrom(this.table, this.join));
    query.push(this.qWhere(this.where));
    query.push(this.qGroup(this.group, this.fields));
    query.push(this.qOrder(this.order));
    query.push(this.qLimit(this.limit, this.offset));
    return query.filter((q) => q).join(Query.SQLSectionDelimiter);
  }

  getUpdate() {
    const query: string[] = [];
    const pTable = this.parseTable(this.toTable);
    query.push("UPDATE");
    query.push(pTable.table);
    query.push(this.qSet(this.setFields));
    const iWhere = this.qWhere(this.where);
    query.push(iWhere);
    const accessUpd = new BasicQuery(0, this.token, this.userId);
    if (accessUpd.needCheckAccess(pTable.table)) {
      const sqlAcc =
        "id in (" + accessUpd.allowTableData(pTable.table, "id", 20) + ")";
      query.push(iWhere ? `AND ${sqlAcc}` : `WHERE  ${sqlAcc}`);
    }
    return query.filter((q) => q).join(Query.SQLSectionDelimiter);
  }

  getInsert() {
    const query: string[] = [];
    const pTable = this.parseTable(this.toTable);
    query.push("INSERT INTO");
    query.push(pTable.table);
    query.push(this.qInsert(this.toFields));
    query.push(this.qFrom(this.table, this.join));
    const iWhere = this.qWhere(this.where);
    query.push(iWhere);
    const accessIns = new BasicQuery(0, this.token, this.userId);
    if (accessIns.needCheckAccess(pTable.table)) {
      const sqlAcc =
        "EXISTS (" + accessIns.allowTableData(pTable.table, "id", 10) + ")";
      query.push(iWhere ? `AND ${sqlAcc}` : `WHERE  ${sqlAcc}`);
    }

    return query.filter((q) => q).join(Query.SQLSectionDelimiter);
  }

  getDelete() {
    const query: string[] = [];
    const pTable = this.parseTable(String(this.table));
    query.push("DELETE FROM");
    query.push(pTable.table);
    const iWhere = this.qWhere(this.where);
    query.push(iWhere);
    const accessUpd = new BasicQuery(0, this.token, this.userId);
    if (accessUpd.needCheckAccess(pTable.table)) {
      const sqlAcc =
        "AND id in (" + accessUpd.allowTableData(pTable.table, "id", 30) + ")";
      query.push(iWhere ? `AND ${sqlAcc}` : `WHERE  ${sqlAcc}`);
    }
    return query.filter((q) => q).join(Query.SQLSectionDelimiter);
  }

  qInsert(fields: string[]) {
    let query = "(";
    if (fields) {
      let num = 0;
      const fieldList: string[] = [];
      const valueList: string[] = [];
      for (const key in fields) {
        let value = "";
        if (Object.hasOwnProperty.call(fields, key)) {
          num++;
          fieldList.push(`"${key}"`);
          valueList.push("$" + num);
          value = getOperator(fields[key], this.userId)[1];
          this.values.push(value);
        }
      }
      query += fieldList.join(", ") + ")";
      query += "\nSELECT " + valueList.join(", ") + "";
    }
    return query;
  }

  parseTable(tbl: string) {
    let table = tbl;
    let scheme = defaultSchema;
    const sp = table.split(".");
    if (sp.length === 2) {
      scheme = sp[0];
      table = sp[1];
    }
    return {
      table: scheme + "." + table,
    };
  }

  qFrom(
    tables: string | (string | IRestGet<Fields, _TBDALLTABLES>)[],
    join: string[]
  ) {
    let tableArray: any[] = [];
    tableArray = tableArray.concat(tables);
    const from = new JoinTables(
      tableArray,
      join,
      this.num + this.values.length,
      this.token,
      this.userId
    );
    this.values = this.values.concat(from.getValues());
    return from.toString();
  }

  qSet(fields: {
    [key: string]:
      | string
      | number
      | boolean
      | Array<string | number | boolean>
      | IRestGet<Fields, _TBDALLTABLES>
      | null;
  }) {
    const set = new UpdateFields(
      fields,
      this.num + this.values.length,
      this.token,
      this.userId
    );
    this.values = this.values.concat(set.getValues());
    return set.toString();
  }

  qSelect(fields: Array<string | IRestGet<Fields, _TBDALLTABLES>>) {
    const select = new SelectFields(
      fields,
      this.num + this.values.length,
      this.token,
      this.userId
    );
    this.values = this.values.concat(select.getValues());
    return select.toString();
  }

  qWhere(wheres: { [x: string]: any }[] | { [x: string]: any }) {
    const where = new WhereFilter(
      wheres,
      this.num + this.values.length,
      this.token,
      this.userId
    );
    this.values = this.values.concat(where.getValues());
    return where.toString();
  }

  qOrder(order: string[]) {
    const query: string[] = [];
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

  qGroup(
    group: string[],
    fields: Array<string | IRestGet<Fields, _TBDALLTABLES>>
  ) {
    const query: string[] = [];
    let checkSelectFielsd = true;
    group.forEach((e) => {
      if (
        fields.find((f) => {
          let res = false;
          if (typeof f === "string") {
            res = f.includes(e);
          }
          return res;
        })
      ) {
        query.push(e);
      } else {
        checkSelectFielsd = false;
      }
    });
    if (query.length === 0 || !checkSelectFielsd) {
      return "";
    }
    return "GROUP BY " + query.join(", ");
  }

  qLimit(limit: number, offset: number) {
    let query: string[] = [];
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
