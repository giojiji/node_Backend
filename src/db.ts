import mysql from "mysql";
import util from "util";
import dotenv from 'dotenv';


dotenv.config();


var pool = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBDATABASE,
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
