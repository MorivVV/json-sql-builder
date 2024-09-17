import { IJMQL } from "../types/restApi";
type ArrayType<T> = T extends readonly [...infer Item] ? Item[number] extends string ? Item[number] extends `${infer A}` ? A extends `${string}:${infer B}` ? B : A : never : Item[number] extends number ? Item[number] : never : never;
/**
 *
 * Функция получения данных из запроса в формате JSON
 */
export declare const mqlFetchQuery: <T extends Record<string, any> & {
    table: string;
}>(mql: IJMQL<T>, url: string, token?: string) => Promise<{ [K in ArrayType<typeof mql.fields>]: string; }[]>;
export {};
