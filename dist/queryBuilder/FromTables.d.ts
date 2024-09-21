import { IRestGet } from "../types/restApi";
import { BasicQuery } from "./BasicQuery";
interface ITableList {
    table: string;
    alias: string;
    use: boolean;
}
export declare class FromTables extends BasicQuery {
    tables: ITableList[];
    /**По умолчанию все таблицы проверяются на доступ
     * можно исключить проверку через этот массив на схемы
     */
    static notAccessShemeOrTable: string[];
    /**Принудительная проверка таблиц
     * на все таблицы, указанные в этом массиве будет наложена проверка доступа, даже если они исключены
     */
    static forcedAccessTables: string[];
    constructor(tables: Array<string | IRestGet>, valNum: number | undefined, token: string, userId: string);
    private stringTable;
    private _subQuery;
    private addAccess;
}
export {};
