import { runQuery, selectFromDatabase } from "../util/db";


export const selectUserData = async (email: string) => {
    const userData = await selectFromDatabase("select * from users where email = ?", [email]);
    return userData[0]
};

export const insertUserData = async (firstName: string, lastName: string, email: string, mobile: string, password: string) => {
    await runQuery("insert into users (firstName, lastName, email, mobile, password, token) values (?, ?, ?, ?, ?, UUID())",
    [firstName, lastName, email, mobile, password]);
};
