import type { IrestDelete, IRestGet, IrestInsert, IrestUpdate } from "../types/restApi";
declare class Query {
    private toTable;
    private fields;
    private table;
    private toFields;
    private setFields;
    private join;
    private where;
    private group;
    private order;
    private limit;
    private offset;
    private num;
    private values;
    private query;
    private token;
    private userId;
    constructor(sqlObj: IRestGet | IrestUpdate | IrestDelete | IrestInsert, valNum: number | undefined, token: string, userId: string);
    getValues(): (string | number | boolean | (string | number | boolean)[] | IRestGet<string> | null)[];
    getSelect(): string;
    getUpdate(): string;
    getInsert(): string;
    getDelete(): string;
    qInsert(fields: string[]): string;
    parseTable(tbl: string): {
        table: string;
    };
    qFrom(tables: string | (string | IRestGet)[], join: string[]): string;
    qSet(fields: {
        [key: string]: string | number | boolean | Array<string | number | boolean> | IRestGet | null;
    }): string;
    qSelect(fields: Array<string | IRestGet>): string;
    qWhere(wheres: {
        [x: string]: any;
    }[] | {
        [x: string]: any;
    }): string;
    qOrder(order: string[]): string;
    qGroup(group: string[], fields: Array<string | IRestGet>): string;
    qLimit(limit: number, offset: number): string;
}
export default Query;
