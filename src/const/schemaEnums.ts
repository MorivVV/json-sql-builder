export const enum EJIRA {
  comments = "jira.comments",
  issue_service = "jira.issue_service",
  releases = "jira.releases",
  defects = "jira.defects",
  issue = "jira.issues",
  releases_rovs = "jira.ci_jira_releases",
  projects = "jira.jira_projects",
  issues = "jira.jira_issues",
  old_defs = "jira.ci_jira_defects",
}

export const enum EPGCATALOG {
  pg_tables = "pg_catalog.pg_tables",
  pg_attribute = "pg_catalog.pg_attribute",
  pg_namespace = "pg_catalog.pg_namespace",
  pg_constraint = "pg_catalog.pg_constraint",
  pg_class = "pg_catalog.pg_class",
}
export const enum EINFORMATIONSCHEMA {
  columns = "information_schema.columns",
}

export const enum ECONFIG {
  bd_driver = "config.bd_driver",
  data_bases = "config.data_bases",
  default_settings = "config.default_settings",
  individual_user_settings = "config.individual_user_settings",
  techemail = "config.techemail",
}
export const enum ECONFA {
  block = "confa.block",
  content = "confa.content",
  pages = "confa.pages",
}

export const enum ECHECKROOM {
  employees = "checkroom.employees",
  r_admins = "checkroom.r_admins",
  r_box = "checkroom.r_box",
  r_departs = "checkroom.r_departs",
  r_location = "checkroom.r_location",
  r_sessions = "checkroom.r_sessions",
  r_users = "checkroom.r_users",
}

export const enum EKNOWLEGEBASE {
  browser_list = "browser_list",
  bz_audit = "bz_audit",
  bz_auto_systems = "bz_auto_systems",
  bz_contact_matrix = "bz_contact_matrix",
  bz_favorites_post = "bz_favorites_post",
  bz_group_register = "bz_group_register",
  bz_ip_addres = "bz_ip_addres",
  bz_post = "bz_post",
  bz_post_attach = "bz_post_attach",
  bz_post_terms = "bz_post_terms",
  bz_postmeta = "bz_postmeta",
  bz_send_mails = "bz_send_mails",
  bz_server_info = "bz_server_info",
  bz_user_group = "bz_user_group",
  bz_users = "bz_users",
  bz_users_ip = "bz_users_ip",
  bz_user_tokens = "bz_user_tokens",
  bz_users_params = "bz_users_params",
  bz_version = "bz_version",
  cron_jobs = "cron_jobs",
  cron_jobs_audit = "cron_jobs_audit",
  cron_script_params = "cron_script_params",
  cron_scripts = "cron_scripts",
  dezh_book = "dezh_book",
  dezh_info_accept = "dezh_info_accept",
  dezh_reports = "dezh_reports",
  eks_dezh = "eks_dezh",
  emails = "emails",
  global_url_list = "global_url_list",
  jenkins_runs = "jenkins_runs",
  mail_groups = "mail_groups",
  mail_list = "mail_list",
  partition_access = "partition_access",
  pg_types_fields = "pg_types_fields",
  place = "place",
  ppr_proccess = "ppr_proccess",
  ppr_task = "ppr_task",
  ppr_task_status = "ppr_task_status",
  ppr_type = "ppr_type",
  rights_elements = "rights_elements",
  rights_table = "rights_table",
  roles = "roles",
  roles_access = "roles_access",
  roles_users = "roles_users",
  search_post_index = "search_post_index",
  server_place = "server_place",
  server_stand = "server_stand",
  sm_list = "sm_list",
  sm_url_patterns = "sm_url_patterns",
  sys_sql_query = "sys_sql_query",
  sys_sql_query_audit = "sys_sql_query_audit",
  tags = "tags",
  terms = "terms",
  upload_files = "upload_files",
  url_resource = "url_resource",
  user_access = "user_access",
  work_group = "work_group",
  work_group_employees = "work_group_employees",
  ws_channels = "ws_channels",
  ws_message = "ws_message",
  ws_room = "ws_room",
  ws_subscribes = "ws_subscribes",
}
export type TBDALLTABLES = `${
  | EPGCATALOG
  | EINFORMATIONSCHEMA
  | ECHECKROOM
  | ECONFA
  | ECONFIG
  | EKNOWLEGEBASE
  | EJIRA}`;
