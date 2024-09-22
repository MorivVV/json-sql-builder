// import Query from "../server/routes/controllers/api/creators/classQuery";
import { IRestGet } from "../types/restApi";
import { BasicQuery } from "./BasicQuery";

export class UpdateFields extends BasicQuery {
  private fields: string[] = [];

  constructor(
    set: {
      [key: string]:
        | string
        | number
        | null
        | boolean
        | Array<string | number | boolean>
        | IRestGet;
    },
    valNum = 0,
    token: string,
    userId: string
  ) {
    super(valNum, token, userId);
    let test = 0;
    for (const key in set) {
      if (Object.prototype.hasOwnProperty.call(set, key)) {
        const element = set[key];
        if (
          typeof element === "string" ||
          typeof element === "boolean" ||
          typeof element === "number" ||
          element === null ||
          Array.isArray(element)
        ) {
          const parsedField = this.changeParameterValue(
            this.parseParameter(element)
          );
          const arrParam: Array<string | number | boolean | null> = [];
          arrParam.push(`"${key}"`);
          arrParam.push("=");
          const currentParamNum = this.valNum + this.values.length + 1;
          arrParam.push(
            (parsedField.field || "$" + currentParamNum) + parsedField.type
          );
          if (!parsedField.field) {
            this.values.push(parsedField.value);
          }
          this.fields.push(arrParam.join(" "));
        } else if (
          Object.prototype.toString.call(element) === "[object Object]"
        ) {
          const cSelect = this.subQuery(element as IRestGet);
          const arrParam: Array<string | number | boolean | null> = [];
          arrParam.push(`"${key}"`);
          arrParam.push("=");

          arrParam.push(`(${cSelect})`);
          this.fields.push(arrParam.join(" "));
        }
        test++;
      }
    }
    if (test === 0) {
      return;
    }
    this.queryString = "SET ";
  }

  toString() {
    return this.queryString + this.fields.join(", ");
  }
}
