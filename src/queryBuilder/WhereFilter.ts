import { IRestGet, ISQLParam } from "../types/restApi";
import { BasicQuery } from "./BasicQuery";

export class WhereFilter<
  Fields extends string = string,
  _TBDALLTABLES extends string = string
> extends BasicQuery {
  constructor(
    wheres:
      | {
          [x: string]:
            | string
            | IRestGet<Fields, _TBDALLTABLES>
            | number
            | boolean
            | null;
        }[]
      | {
          [x: string]:
            | string
            | IRestGet<Fields, _TBDALLTABLES>
            | number
            | boolean
            | null;
        },
    valNum = 0,
    token: string,
    userId: string
  ) {
    super(valNum, token, userId);
    let ArrWhere: { [x: string]: any }[] = [];
    ArrWhere = ArrWhere.concat(wheres);
    // console.log("вход значения", valNum);

    this.queryString = this.whereOr(ArrWhere);
  }

  changeParameterValue(parameter: ISQLParam) {
    parameter = super.changeParameterValue(parameter);
    switch (parameter.value) {
      case null:
        parameter.value = null;
        parameter.operator = "IS";
        parameter.field = "NULL";
        break;

      case "!null":
        parameter.value = null;
        parameter.operator = "IS";
        parameter.field = "NOT NULL";
        break;

      default:
        break;
    }
    return { ...parameter };
  }

  intepretatedField(field: string): string {
    const key = field.replace(/@\d+/, "");
    return key;
  }

  subQueryOperator(key: string, subQuery: string) {
    const field = this.intepretatedField(key);
    let query = "";
    switch (field) {
      case "EXISTS":
        query = `EXISTS (${subQuery})`;
        break;

      case "NOT_EXISTS":
        query = `NOT EXISTS (${subQuery})`;
        break;

      default:
        query = `${field} in (${subQuery})`;
        break;
    }
    return query;
  }

  whereAnd(object: {
    [x: string]:
      | string
      | IRestGet<Fields, _TBDALLTABLES>
      | number
      | boolean
      | null;
  }) {
    const query: string[] = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        if (Array.isArray(element)) {
          query.push("(" + this.whereOr(element) + ")");
        } else if (
          Object.prototype.toString.call(element) === "[object Object]"
        ) {
          const cSelect = this.subQuery(
            element as IRestGet<Fields, _TBDALLTABLES>
          );
          query.push(this.subQueryOperator(key, cSelect));
        } else {
          const parseWhereValue = this.changeParameterValue(
            this.parseParameter(element as string | number | boolean)
          );
          const arrParam: Array<string | number | boolean | null> = [];
          arrParam.push(this.intepretatedField(key));
          arrParam.push(parseWhereValue.operator);
          const currentParamNum = this.valNum + this.values.length + 1;
          arrParam.push(
            (parseWhereValue.field || "$" + currentParamNum) +
              parseWhereValue.type
          );
          if (!parseWhereValue.field) {
            this.values.push(parseWhereValue.value);
          }
          query.push(arrParam.join(" "));
          // console.log(parseWhereValue);
        }
        // console.log("цикл значения", this.valNum);
      }
    }
    return query.join("\nAND ");
  }

  whereOr(
    array: {
      [x: string]:
        | string
        | IRestGet<Fields, _TBDALLTABLES>
        | number
        | boolean
        | null;
    }[]
  ) {
    const query: string[] = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      const w = this.whereAnd(element);
      if (w) query.push(`(${w})`);
    }
    return query.join("\n OR ");
  }

  toString() {
    // console.log(this.queryString, this.values);

    return this.queryString ? "\nWHERE " + this.queryString : "";
  }
}
