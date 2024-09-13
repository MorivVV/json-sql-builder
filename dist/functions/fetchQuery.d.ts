import { IJMQL } from "../types/restApi";
export declare const mqlFetchQuery: <T extends Record<"table", string>>(mql: IJMQL<T>, url: string, token?: string) => Promise<T[]>;
