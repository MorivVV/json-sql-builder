import { IRestGet } from "@/types/restApi";
import { BasicQuery } from "./BasicQuery";

export class SelectFields extends BasicQuery {
  private fields: string[] = [];

  constructor(fields: Array<string | IRestGet> | undefined, valNum = 0, token: string, userId: string) {
    super(valNum, token, userId);
    this.queryString = "SELECT ";
    if (!fields || fields.length === 0) {
      this.fields.push("*");
      return;
    }
    for (let index = 0; index < fields.length; index++) {
      const element = fields[index];
      if (typeof element === "string") {
        const parsedField = this.prepareField(element);
        if (index === 0 && parsedField === "DISTINCT") {
          this.queryString += "DISTINCT ";
        } else {
          this.fields.push(parsedField);
        }
      } else if (Object.prototype.toString.call(element) === "[object Object]") {
        const cSelect = this.subQuery(element as IRestGet);
        this.fields.push(`(${cSelect})`);
      }
    }
  }

  toString() {
    return this.queryString + this.fields.join(", ");
  }
}
