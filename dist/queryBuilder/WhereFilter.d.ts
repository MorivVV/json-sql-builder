import { IRestGet, ISQLParam } from "../types/restApi";
import { BasicQuery } from "./BasicQuery";
export declare class WhereFilter<Fields extends string = string, _TBDALLTABLES extends string = string> extends BasicQuery {
    constructor(wheres: {
        [x: string]: string | IRestGet<Fields, _TBDALLTABLES> | number | boolean | null;
    }[] | {
        [x: string]: string | IRestGet<Fields, _TBDALLTABLES> | number | boolean | null;
    }, valNum: number | undefined, token: string, userId: string);
    changeParameterValue(parameter: ISQLParam): {
        operator: string;
        field: string | undefined;
        value: string | number | boolean | null | Array<string | number | boolean>;
        type: string;
    };
    intepretatedField(field: string): string;
    subQueryOperator(key: string, subQuery: string): string;
    whereAnd(object: {
        [x: string]: string | IRestGet<Fields, _TBDALLTABLES> | number | boolean | null;
    }): string;
    whereOr(array: {
        [x: string]: string | IRestGet<Fields, _TBDALLTABLES> | number | boolean | null;
    }[]): string;
    toString(): string;
}
