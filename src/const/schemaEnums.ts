export const enum EPGCATALOG {
  pg_tables = "pg_catalog.pg_tables",
  pg_attribute = "pg_catalog.pg_attribute",
  pg_namespace = "pg_catalog.pg_namespace",
  pg_constraint = "pg_catalog.pg_constraint",
  pg_class = "pg_catalog.pg_class",
}
export const enum EINFORMATIONSCHEMA {
  columns = "information_schema.columns",
  tables = "information_schema.tables",
  attributes = "information_schema.attributes",
  column_options = "information_schema.column_options",
  check_constraints = "information_schema.check_constraints",
  key_column_usage = "information_schema.key_column_usage",
}

export const enum ECONFA {
  block = "confa.block",
  content = "confa.content",
  pages = "confa.pages",
}

export const enum EDEFAULTSCHEMA {
  browser_list = "browser_list",
  bz_audit = "bz_audit",
  bz_favorites_post = "bz_favorites_post",
  bz_ip_addres = "bz_ip_addres",
  bz_users = "bz_users",
  bz_users_ip = "bz_users_ip",
  bz_user_tokens = "bz_user_tokens",
  bz_users_params = "bz_users_params",
  bz_version = "bz_version",
  partition_access = "partition_access",
  rights_elements = "rights_elements",
  rights_table = "rights_table",
  roles = "roles",
  roles_access = "roles_access",
  roles_users = "roles_users",
  user_access = "user_access",
}

export type TBDALLTABLES = `${
  | EPGCATALOG
  | EINFORMATIONSCHEMA
  | ECONFA
  | EDEFAULTSCHEMA}`;
