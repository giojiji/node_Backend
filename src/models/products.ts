import { selectFromDatabase } from "../util/db";

export const selectProducts = async (searchName?: string) => {
  if (searchName) {
    const data = await selectFromDatabase("SELECT * FROM products WHERE name LIKE ? ORDER BY id DESC", [`%${searchName}%`]);
    return data;
  } else {
    const data = await selectFromDatabase("SELECT * FROM products order by id desc");
    return data;
  }
};
