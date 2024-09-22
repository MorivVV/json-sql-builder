import { IRestGet } from "../types/restApi";
import { BasicQuery } from "./BasicQuery";
export declare class UpdateFields extends BasicQuery {
    private fields;
    constructor(set: {
        [key: string]: string | number | null | boolean | Array<string | number | boolean> | IRestGet;
    }, valNum: number | undefined, token: string, userId: string);
    toString(): string;
}
