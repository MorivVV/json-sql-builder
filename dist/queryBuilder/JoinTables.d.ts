import { IRestGet } from "../types/restApi";
import { FromTables } from "./FromTables";
export declare class JoinTables extends FromTables {
    private joinString;
    constructor(tables: Array<string | IRestGet>, joins: string[] | undefined, valNum: number | undefined, token: string, userId: string);
    private joinTable;
    private joinFields;
    private tableAsAlias;
    private parseJoinFields;
    private makeJoin;
    toString(): string;
}
