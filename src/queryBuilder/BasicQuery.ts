import { defaultSchema } from "@/config/globalSetting";
import { allowOperators, postgresTypes } from "./queryConst";
import { IRestGet, ISQLParam } from "@/types/restApi";
import Query from "@/creators/classQuery";

export class BasicQuery {
  values: Array<string | IRestGet | number | boolean | null | Array<string | number | boolean>> = [];
  queryString = "";
  userId = "";
  valNum = 0;
  token = "";
  constructor(valNum = 0, token: string, user_id: string) {
    this.userId = user_id;
    this.valNum = valNum;
    this.token = token;
  }
  getValues() {
    return this.values;
  }

  prepareField(fieldValue: string) {
    // разделяем строку по двоеточиям
    let splitted = fieldValue.split(":");
    if (splitted.indexOf("") === 1) {
      // если нашли пустую строку, значит это тип переменной для поля
      splitted[2] = splitted[0] + "::" + splitted[2];
      splitted = splitted.slice(2);
    }
    return splitted.join(" AS ");
  }

  splitTable(table: string) {
    const splitT = table.split(".");
    let scheme = defaultSchema;
    if (splitT.length === 2) {
      scheme = splitT[0];
      table = splitT[1];
    }
    return {
      scheme,
      table,
    };
  }

  parseParameter(parameterString: string | number | boolean | null | Array<string | number | boolean>): ISQLParam {
    let field: string | undefined;
    let operator = "=";
    let type = "";
    let value: string | number | boolean | null | undefined | Array<string | number | boolean>;

    if (typeof parameterString !== "string" || !parameterString.includes(":")) {
      value = parameterString;
    } else {
      if (parameterString.includes("::")) {
        // находим указание типов
        const typesString = parameterString.split("::");
        for (let index = typesString.length - 1; index > 0; index--) {
          const testType = typesString[index];
          if (postgresTypes.includes(testType)) {
            type = "::" + testType + type;
            typesString.pop();
          } else {
            break;
          }
        }
        // обратно склеиваем оставшийся массив в строку
        parameterString = typesString.join("::");
      }
      const splitParameters = parameterString.split(":");

      const testOperator = splitParameters[0];
      if (allowOperators.includes(testOperator)) {
        if (testOperator.indexOf("@@") === 0) {
          // имя поля в качестве значения
          field = splitParameters[1];
          // проверяем наличие оператора для сравнения
          const fieldOperator = testOperator.substring(2);
          // изменяем оператор, если он указывался для сравнения
          if (fieldOperator) operator = fieldOperator;
        } else {
          operator = testOperator;
        }
        splitParameters.shift();
      }
      value = splitParameters.join(":");
    }

    return {
      operator,
      field,
      value,
      type,
    };
  }

  changeParameterValue(parameter: ISQLParam) {
    // проверяем предопределенные глобальные переменные
    switch (parameter.value) {
      case "${currentUser}":
        parameter.value = this.userId;
        break;

      case "${currentTimestamp}":
        parameter.value = new Date().toISOString();
        break;

      case "null":
        parameter.value = null;
        break;

      default:
        break;
    }
    return { ...parameter };
  }

  subQuery(restTable: IRestGet) {
    const childSQL = new Query(restTable, this.valNum + this.values.length, this.token, this.userId);
    const cSelect = childSQL.getSelect();
    this.values = this.values.concat(childSQL.getValues());
    return cSelect;
  }
}
