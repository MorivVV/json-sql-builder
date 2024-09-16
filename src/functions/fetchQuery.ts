import { IJMQL } from "../types/restApi";
type ArrayType<T> = T extends readonly [...infer Item]
  ? Item[number] extends string
    ? Item[number] extends `${infer A}`
      ? A extends `${string}:${infer B}`
        ? B
        : A
      : never
    : Item[number] extends number
    ? Item[number]
    : never
  : never;

export const mqlFetchQuery = async <
  T extends Record<string, any> & { table: string }
>(
  mql: IJMQL<T>,
  url: string,
  token = ""
): Promise<{ [K in ArrayType<typeof mql.fields>]: string }[]> => {
  const data = JSON.stringify(mql);
  const conf: RequestInit = {
    body: data,
    credentials: "same-origin",
    method: "POST",
    headers: {
      "V-Token": token,
      "Content-Type": "application/json;charset=utf-8",
    },
  };

  return fetch(url, conf).then(async (response) => {
    let restext: any = "";
    try {
      restext = await response
        .json()
        .catch(() => ({ err: { code: response.status } }));
    } catch (error) {
      restext = await response.text();
    }
    return restext;
  });
};
