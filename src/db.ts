import mysql from "mysql";
import util from "util";

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "project",
});

const query: (sql: string, values?: any[]) => Promise<any> = util
  .promisify(pool.query)
  .bind(pool);

export async function selectFromDatabase(queryString: string, arr?: any[]) {
  const queryResult = await query(queryString, arr);
  return queryResult;
}

export async function runQuery(queryString: string, arr?: any[]) {
  await query(queryString, arr);
}
