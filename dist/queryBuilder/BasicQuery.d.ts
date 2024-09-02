import { IRestGet, ISQLParam } from "../types/restApi";
export declare class BasicQuery {
    values: Array<string | IRestGet | number | boolean | null | Array<string | number | boolean>>;
    queryString: string;
    userId: string;
    valNum: number;
    token: string;
    constructor(valNum: number | undefined, token: string, user_id: string);
    getValues(): (string | number | boolean | IRestGet<string> | (string | number | boolean)[] | null)[];
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
    subQuery(restTable: IRestGet): string;
}
