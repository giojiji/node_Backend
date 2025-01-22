import { Request, Response  } from 'express';
import { deleteStudent, insertStudent, selectStudentById, selectStudents, updateStudent } from '../models/students';

// 201: Created
// 400: Bad Request
// 404: Not Found
// 401: Unauthorized
// 500: Internal Server Error

//For env File 


export const getStudents  = async (req: Request, res: Response) => {
  const {name} = req.query
  const data = await selectStudents(name?.toString());
  res.send({"data":data, "count": data.length});
};

export const addStudent  = async (req: Request, res: Response) => {
    const {Fullname, date} = req.body
    if(!Fullname || !date) {
      res.status(400).send({message: "not valid data"});
      return;
    }
  
    if(typeof Fullname !== 'string') {
      res.status(400).send({message: "inccorect form"});
      return;
    }
  
    try {
      await insertStudent(Fullname, date)
      res.status(201).send({message: "user created"});
    }
    catch (err) {
        res.status(400).send({message: err})
    }
  
}

export const editStudent  = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Fullname, date } = req.body;

    if (!Fullname || !date) {
      res.status(400).send({ message: 'not valid data' });
      return
    }

  
    const studentExists = await selectStudentById(id)
    if (!studentExists.length) {
      res.status(404).send({ message: "Item not found to update" });
      return
    }
  
    try {
      await updateStudent(Fullname, date, id)
      res.status(200).send({message: 'Item updated successfully'});  
    }
    catch (err) {
        res.status(400).send({message: err})
    }
  
};

export const removeStudent = async (req: Request, res: Response) => {
    const {id} = req.params
  
    const studentExists = await selectStudentById(id)
    if (!studentExists.length) {
      res.status(404).send({ message: "Item not found to delete" });
      return
    }
  
    try {
      await deleteStudent(id)
      res.status(200).send({message: "user deleted"});
    }
    catch (err) {
        res.status(400).send({message: err})
    }
  
}