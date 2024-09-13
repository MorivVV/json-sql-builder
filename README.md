The package is designed to convert JSON-specific queries to SQL.  
There is support for nested queries.  
By default, all queries are wrapped in a construct that imposes a check of access rights to table data
To exclude schema names in which you do not need to do an access check, you can use a static variable in the FromTables class

```ts
import { FromTables } from "@morivvv/json-sql-builder/dist/queryBuilder/FromTables";

FromTables.accessTable = ["pg_catalog", "information_schema"];
```

Any query is built through the Query class. The class is automatically divided into sections. Depending on the JSON being passed, you can get the result for SELECT, INSERT, UPDATE, DELETE by calling different methods of the class

```ts
import { IJiraIssues } from "./schemas/jira";
import Query from "@morivvv/json-sql-builder";
import { ICreateTableFields } from "@morivvv/json-sql-builder/dist/types/restApi";
import {
  EBILLING,
  EJIRA,
} from "@morivvv/json-sql-builder/dist/const/schemaEnums";
import { FromTables } from "@morivvv/json-sql-builder/dist/queryBuilder/FromTables";
import { IBillingResources } from "./schemas/billing";

FromTables.accessTable = ["jira"];
const a = new Query<
  | ICreateTableFields<keyof IBillingResources, "e">
  | ICreateTableFields<keyof IJiraIssues, "au">,
  `${EBILLING | EJIRA}`
>(
  {
    fields: [
      "DISTINCT",
      "au.issuetype",
      "au.comments",
      "au.comments:alias_comm",
      "e.naimen",
    ],
    from: [
      "billing.addressees:u",
      "billing.approvals:e",
      "jira.issues:au",
      "jira.defects",
    ],
    join: ["e.id=au.created", "au.assignee_display_name=au.reporter_tabnum"],
    filter: {
      id: 1,
      test: { from: "test:a", fields: ["a.audit"], filter: { kod_user: 42 } },
    },
  },
  0,
  "token",
  "id"
);
console.log(a.getSelect(), a.getValues());
```

RESULT

```sql
SELECT DISTINCT au.issuetype, au.comments, au.comments AS alias_comm, e.naimen FROM (SELECT *
    FROM billing.approvals AS t
    WHERE
    NOT EXISTS (SELECT 1 FROM jira.rights_table as rt WHERE rt.naimen = 'billing.approvals' AND rt.active=true)
    OR EXISTS (SELECT 1 FROM jira.roles as r
      INNER JOIN jira.roles_users as ru ON r.id = ru.kod_role
      INNER JOIN jira.bz_users as u ON ru.kod_user = u.id
      INNER JOIN jira.bz_user_tokens as ut ON u.id = ut.kod_user
      WHERE ut.session_token = 'token'
      AND r.full_access = true
      AND u.active = true
      AND ut.active = true
      LIMIT 1)
    OR t.id in
    (
      SELECT table_identificator
      FROM jira.rights_elements as re
        INNER JOIN jira.rights_table as rt ON re.kod_table = rt.id
        INNER JOIN jira.roles as r ON re.kod_role = r.id
        INNER JOIN jira.roles_users as ru ON r.id = ru.kod_role
        INNER JOIN jira.bz_users as u ON ru.kod_user = u.id
        INNER JOIN jira.bz_user_tokens as ut ON u.id = ut.kod_user
      WHERE rt.naimen = 'billing.approvals'
        AND ut.session_token = 'token'
        AND u.active = true
        AND ut.active = true
    ) ) AS e
INNER JOIN jira.issues AS au
        ON e.id = au.created
        AND au.assignee_display_name = au.reporter_tabnum, (SELECT *
    FROM billing.addressees AS t
    WHERE
    NOT EXISTS (SELECT 1 FROM jira.rights_table as rt WHERE rt.naimen = 'billing.addressees' AND rt.active=true)
    OR EXISTS (SELECT 1 FROM jira.roles as r
      INNER JOIN jira.roles_users as ru ON r.id = ru.kod_role
      INNER JOIN jira.bz_users as u ON ru.kod_user = u.id
      INNER JOIN jira.bz_user_tokens as ut ON u.id = ut.kod_user
      WHERE ut.session_token = 'token'
      AND r.full_access = true
      AND u.active = true
      AND ut.active = true
      LIMIT 1)
    OR t.id in
    (
      SELECT table_identificator
      FROM jira.rights_elements as re
        INNER JOIN jira.rights_table as rt ON re.kod_table = rt.id
        INNER JOIN jira.roles as r ON re.kod_role = r.id
        INNER JOIN jira.roles_users as ru ON r.id = ru.kod_role
        INNER JOIN jira.bz_users as u ON ru.kod_user = u.id
        INNER JOIN jira.bz_user_tokens as ut ON u.id = ut.kod_user
      WHERE rt.naimen = 'billing.addressees'
        AND ut.session_token = 'token'
        AND u.active = true
        AND ut.active = true
    ) ) AS u, jira.defects AS at3
WHERE (id = $1
AND test in (SELECT a.audit FROM jira.test AS a
WHERE (kod_user = $2)   ))    [ 1, 42 ]
```

TS Intellij from interface

```ts
interface A1 {
  table: "blocl";
  key: 5;
  test: string;
  val: string;
  creatgdf: boolean;
  dte: number;
}

interface A2 {
  table: "blocl2";
  valu: number;
  red: false;
  dte: number;
}
interface A3 {
  table: "test.blocl3";
  valu: number;
  red: false;
  dte: number;
}
const a: IJMQL<
  TMergeTInterface<
    IAliasTableFields<A2, "a2">,
    IAliasTableFields<A1, "a1">,
    IAliasTableFields<A3, "a3">
  >
> = {
  from: ["test.blocl3:a3", "blocl:a1", "blocl2:a2", "test.blocl3:a3"],
  fields: ["DISTINCT", "a1.dte"],
  filter: [
    {
      "a1.creatgdf": "!=:false",
      "a3.valu": {
        from: ["test.blocl3:a3"],
        fields: ["a3.dte"],
        filter: { "a1.key": "@@<=:a3.red" },
      },
    },
  ],
};
```
