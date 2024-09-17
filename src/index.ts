export type {
  IJMQL,
  IAliasTableFields,
  ICreateTableFields,
  TMergeTInterface,
  IRestGet,
  IrestDelete,
  IrestInsert,
  IrestUpdate,
} from "./types/restApi";
export { Query } from "./creators/classQuery";
export { FromTables } from "./queryBuilder/FromTables";

export { mqlFetchQuery } from "./functions/fetchQuery";
