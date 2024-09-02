import { IRestGet } from "@/types/restApi";
import { BasicQuery } from "./BasicQuery";
export declare class SelectFields extends BasicQuery {
    private fields;
    constructor(fields: Array<string | IRestGet> | undefined, valNum: number | undefined, token: string, userId: string);
    toString(): string;
}
