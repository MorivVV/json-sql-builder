import { BasicQuery } from "./BasicQuery";
import { IRestGet } from "@/types/restApi";
interface ITableList {
    table: string;
    alias: string;
    use: boolean;
}
export declare class FromTables extends BasicQuery {
    tables: ITableList[];
    constructor(tables: Array<string | IRestGet>, valNum: number | undefined, token: string, userId: string);
    private stringTable;
    private _subQuery;
    private addAccess;
}
export {};
