import { IRestGet, ISQLParam } from "../types/restApi";
export declare class BasicQuery<Fields extends string = string, _TBDALLTABLES extends string = string> {
    values: Array<string | number | boolean | null | Array<string | number | boolean>>;
    queryString: string;
    userId: string;
    valNum: number;
    token: string;
    constructor(valNum: number | undefined, token: string, user_id: string);
    getValues(): (string | number | boolean | (string | number | boolean)[] | null)[];
    prepareField(fieldValue: string): string;
    splitTable(table: string): {
        scheme: string;
        table: string;
    };
    parseParameter(parameterString: string | number | boolean | null | Array<string | number | boolean>): ISQLParam;
    changeParameterValue(parameter: ISQLParam): {
        operator: string;
        field: string | undefined;
        value: string | number | boolean | null | Array<string | number | boolean>;
        type: string;
    };
    subQuery(restTable: IRestGet<Fields, _TBDALLTABLES>): string;
}
