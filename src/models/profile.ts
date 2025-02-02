import { selectFromDatabase } from "../util/db";

export const selectUserProfile = async (id: string) => {
    const userData = await selectFromDatabase("select id, firstName, lastName, email, mobile, hasPhoto, imageUrl from customers where id = ?", [id]);
    return userData[0]
};


export const updateUserPhotoState = async (state: boolean, id?: string, path?: string | null) => {
    const userData = await selectFromDatabase("update customers set hasPhoto = ?, imageUrl = ? where id = ?", [state, path, id]);
    return userData[0]
};


export const selectMyOrders = async (id: string) => {
    const userData = await selectFromDatabase("select o.id, o.status, o.date, p.name, p.price, p.quantity, p.discount_percent, p.description from customerorders as o inner join products as p on o.productId = p.id where o.customerId = ? order by o.date desc", [id]);
    return userData
};
