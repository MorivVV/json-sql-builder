import { IJMQL } from "../types/restApi";
export declare const mqlFetchQuery: <T extends Record<string, any> & {
    table: string;
}>(mql: IJMQL<T>, url: string, token?: string) => Promise<T[]>;
