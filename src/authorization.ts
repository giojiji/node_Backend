import { selectFromDatabase } from "./db"

export const checkToken = async (token: string | null | undefined) => {
    if(token) {
        const isTokenExist = await selectFromDatabase('select token from users where token = ?', [token])
        if(isTokenExist.length) {
            return true
        }
    }

}