/// <reference types="node" />
export const defaultSchema = process.env.DEFAULT_POSTGRES_SCHEMA || "public";
export const accessTable = process.env.ACCESS_TABLE || [
  "pg_catalog",
  "information_schema",
  "seodo",
];
