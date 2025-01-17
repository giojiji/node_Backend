import express from 'express';
import { addStudent, editStudent, getStudents, removeStudent } from '../controllers/students';
import { isAuth } from '../middleware/is-auth';


export const router = express.Router()


router.get('/', isAuth, getStudents);

router.post('/add', isAuth ,addStudent);

router.put('/edit/:id', isAuth, editStudent);

router.delete('/remove/:id', isAuth, removeStudent);





