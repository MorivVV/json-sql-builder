import { IJMQL } from "../types/restApi";
/**
 *
 * Функция получения данных из запроса в формате JSON
 */
export declare const mqlFetchQuery: <T extends Record<string, any> & {
    table: string;
}, F extends Record<string, any>>(mql: IJMQL<T>, url: string, token?: string) => Promise<F[]>;
