import { currentAuthUser, currentTimestamp } from "@/const/globalRestAPI";
import { TBDMODTABLES, type TBDALLTABLES } from "@/const/schemaEnums";

export interface ajaxData {
  sqlname: string;
  [key: string]: string | number | null | boolean | Array<any> | undefined;
}
export interface fetchParam {
  data: object;
  stateName?: string;
  url?: string;
}
export interface IServerLogsGet {
  fileName?: string;
  typeLog: string;
  datebeg?: string;
  dateend?: string;
}

type TqEXISTS = "EXISTS" | "NOT_EXISTS";
type TOpBase = ">" | ">=" | "=" | "<>" | "<=" | "!=" | "<";
type TOpStr = `${TBoolNegative}${TRegLike}${TCase}`;
type restModValue = typeof currentAuthUser | typeof currentTimestamp | string | number | null | boolean | undefined;

// type restValue<T> = T extends typeof currentAuthUser
//   ? typeof currentAuthUser
//   : T extends typeof currentTimestamp
//   ? typeof currentTimestamp
//   : // | TOpBase
//   // | TOpStr
//   // | string
//   T extends `${TOpStr | TOpBase}:${string}`
//   ? `${TOpStr | TOpBase}:${string}`
//   : T extends number
//   ? number
//   : "" | "null" | null | boolean | undefined;
type restValue =
  | typeof currentAuthUser
  | typeof currentTimestamp
  // | TOpBase
  // | TOpStr
  | `${TOpStr | TOpBase}:${string}`
  | string
  | ""
  | "null"
  | number
  | null
  | boolean
  | undefined;

type restPGType = "" | "::integer" | "::character varying";
type restBasicOperator = ">" | "<" | "=";
type TRegLike = "~" | "~~";
type TPGBool = "t" | "f" | "true" | "false" | boolean;
type TBoolNegative = "" | "!";
type TCase = "" | "*";

type restGetType<Fields extends string = string> = {
  [key in Fields as key extends Fields ? Fields | `${Fields}@${number}` | TqEXISTS | `${TqEXISTS}@${number}` : never]?:
    | restValue
    | `@@:${key}`
    | `@@${TOpBase}:${key}`
    | Array<
        | restValue
        | restGetType<Fields>
        | {
            [key in Fields as key extends Fields ? Fields : string]?: restValue;
          }
      >
    | IRestGet<Fields>
    | undefined;
};
type restFields<Fields extends string = string> =
  | "DISTINCT"
  | Fields
  | number
  | `${Fields}:${string}`
  | `${number}:${string}`
  | `${string}(${Fields},${string}):${string}`
  | `${string}(${Fields | number}):${string}`
  | `${string}(DISTINCT ${Fields}):${string}`
  | IRestGet<Fields>;

type restSortOrder = "-" | "";

type IRestJoin<Fields extends string = string> = `${Fields}=${Fields}`;

type IRestJoinLeft = `${string}=(+)${string}`;

type IRestJoinRight = `${string}=${string}(+)`;

/**
 * Запрос
 */
export interface IRestGet<Fields extends string = string> {
  /**
   * Условие для фильтрации результатов запроса
   * где ключи = полям в запросе
   * все секции объединяются условием AND
   * для указания условия OR, нужно передать массив ключей со значениями
   * в качестве значения может быть использован подзапрос,
   * тогда для поля будет установлен оператор IN (результат запроса)
   */
  filter?: restGetType<Fields> | restGetType<Fields>[];
  /**
   * Секция from указывает на таблицы в БД, из который будет производится выбор данных
   * Для одной таблицы можно передавать текстовую переменную, имя таблицы может не содержать псевдоним
   * Если имена таблиц передаются в виде массива, то псевдоним для таблиц ОБЯЗАТЕЛЕН
   * [`${EPULT.asystems}:s`, `${EPULT.alert_tables}:at`]
   * все таблицы заносятся в enum константы E[SCHEMA], где имя схемы всегда в верхнем регистре
   * В качестве таблицы можно использовать подзапрос, тогда нужно будет использовать параметр alias: в котором пропишется псевдоним для таблицы
   */
  from: TBDALLTABLES | Array<`${TBDALLTABLES}:${string}` | TBDALLTABLES | IRestGet<Fields>>;
  /**
   * Перечисление полей, которые будут возвращены
   * синтаксис имя_поля:алиас
   * Можно использовать подзапрос в качестве поля
   * Для вывода уникальных значений в качестве первого параметра передаем DISTINCT
   */
  fields?: restFields<Fields>[];
  /**
   * Условия объединения таблиц где
   * =(+)слева от поля => LEFT JOIN
   * =справа(+) => RIGHT JOIN
   * = без плюса => INNER JOIN
   */
  join?: Array<IRestJoin<Fields> | IRestJoinLeft | IRestJoinRight>;
  /**
   * Группирует запрос по указанным полям
   */
  group?: Array<Fields>;
  /**
   * Сортировка результата запроса, указвыется название нужного поля/списка полей,
   *  либо порядковый номера полей в результате.
   * знак минус - => устанавливает обратную сортировку
   */
  sort?: Array<`${restSortOrder}${Fields}` | `${restSortOrder}${number}`>;
  /**
   * Лимит на количество выводимых строк
   */
  limit?: number;
  /**
   * Смещение запроса при лимите, если лимит = 10, то смещение =1 выведет с 11 по 20 записи
   */
  page?: number;
  /**
   * Псевдоним для подзапроса
   */
  alias?: string;
  /**
   * Код учетной записи для подключения к БД
   */
  tuz?: number;
}

export interface IrestUpdate<Fields extends string = string> {
  /**
   * Таблица для обновления
   */
  to: TBDMODTABLES;
  set: { [key in Fields]?: restModValue | Array<restModValue> };
  filter?: restGetType<Fields>;
}

export interface IrestInsert<Fields extends string = string> {
  /**
   * Таблица для вставки
   */
  to: TBDMODTABLES;
  fields: { [key in Fields]?: restModValue | Array<restModValue> };
}

export interface IrestDelete<Fields extends string = string> {
  /**
   * Таблица из которой произойдет удаление
   */
  from: TBDMODTABLES;
  /**
   * Условие удаления
   */
  filter?: restGetType<Fields>;
}

interface restError {
  length: number;
  name: string;
  severity: string;
  code: string;
  detail: string;
  schema: string;
  table: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
}

export interface IRestModifyAnswer {
  count: number;
  err: restError;
}

export interface ISQLParam {
  operator: string;
  field: string | undefined;
  value: string | number | boolean | null | Array<string | number | boolean>;
  type: string;
}
