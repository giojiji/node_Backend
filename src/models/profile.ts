import { selectFromDatabase } from "../util/db";

export const selectUserProfile = async (id: string) => {
    const userData = await selectFromDatabase("select id, firstName, lastName, email, mobile, hasPhoto, imageUrl from users where id = ?", [id]);
    return userData[0]
};


export const updateUserPhotoState = async (state: boolean, id?: string, path?: string | null) => {
    const userData = await selectFromDatabase("update users set hasPhoto = ?, imageUrl = ? where id = ?", [state, path, id]);
    return userData[0]
};