import { runQuery, selectFromDatabase } from "../util/db";


export const selectStudentById = async (id: string) => {
  return await selectFromDatabase('SELECT * FROM students where id = ?', [id])
};


export const selectStudents = async (searchName?: string) => {
  if (searchName) {
    const data = await selectFromDatabase("SELECT * FROM students WHERE Fullname LIKE ? ORDER BY id DESC", [`%${searchName}%`]);
    return data;
  } else {
    const data = await selectFromDatabase("SELECT * FROM students order by id desc");
    return data;
  }
};


export const insertStudent = async (Fullname: string, date: string) => {
  await runQuery('INSERT INTO students (Fullname, date) VALUES (?, ?)', [Fullname, date]);
};


export const updateStudent = async (Fullname: string, date: string, id: string) => {
  await runQuery('UPDATE students SET Fullname = ?, date = ? WHERE id = ?', [Fullname, date, id]);
};


export const deleteStudent = async (id: string) => {
  await runQuery('delete from students where id = ?', [id]);
};





