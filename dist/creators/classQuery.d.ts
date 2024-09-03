import type { IrestDelete, IRestGet, IrestInsert, IrestUpdate } from "../types/restApi";
declare class Query<Fields extends string = string, _TBDALLTABLES extends string = string> {
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
    constructor(sqlObj: IRestGet<Fields, _TBDALLTABLES> | IrestUpdate | IrestDelete | IrestInsert, valNum: number | undefined, token: string, userId: string);
    getValues(): (string | number | boolean | (string | number | boolean)[] | null)[];
    getSelect(): string;
    getUpdate(): string;
    getInsert(): string;
    getDelete(): string;
    qInsert(fields: string[]): string;
    parseTable(tbl: string): {
        table: string;
    };
    qFrom(tables: string | (string | IRestGet<Fields, _TBDALLTABLES>)[], join: string[]): string;
    qSet(fields: {
        [key: string]: string | number | boolean | Array<string | number | boolean> | IRestGet<Fields, _TBDALLTABLES> | null;
    }): string;
    qSelect(fields: Array<string | IRestGet<Fields, _TBDALLTABLES>>): string;
    qWhere(wheres: {
        [x: string]: any;
    }[] | {
        [x: string]: any;
    }): string;
    qOrder(order: string[]): string;
    qGroup(group: string[], fields: Array<string | IRestGet<Fields, _TBDALLTABLES>>): string;
    qLimit(limit: number, offset: number): string;
}
export default Query;
