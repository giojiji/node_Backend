import { runQuery, selectFromDatabase } from "../util/db";


export const selectUserDataByEmail = async (email: string) => {
    const userData = await selectFromDatabase("select * from customers where email = ?", [email]);
    return userData[0]
};

export const selectUserDataByMobile = async (mobile: string) => {
    const userData = await selectFromDatabase("select * from customers where mobile = ?", [mobile]);
    return userData[0]
};

export const insertUserData = async (firstName: string, lastName: string, email: string, mobile: string, password: string) => {
    await runQuery("insert into customers (firstName, lastName, email, mobile, password) values (?, ?, ?, ?, ?)",
    [firstName, lastName, email, mobile, password]);
};

export const selectUserDataById = async (id: string | undefined) => {
    const userData = await selectFromDatabase("select * from customers where id = ?", [id]);
    return userData[0]
};

export const updateIsAuthorized = async (id: string) => {
    await selectFromDatabase("update customers set isAuthorized = true where id = ?", [id]);
};

export const updatePassword = async (password: string, id: string | undefined) => {
    await selectFromDatabase("update customers set password = ? where id = ?", [password, id]);
};
