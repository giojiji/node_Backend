import express, { Express, Request, Response , Application } from 'express';
import { runQuery, selectFromDatabase } from '../db';
import { checkToken } from '../authorization';


// 201: Created
// 400: Bad Request
// 404: Not Found
// 401: Unauthorized
// 500: Internal Server Error

//For env File 


export const router = express.Router()

router.use(async (req, res, next) => {
  const token = req.headers.authorization
  const isValidToken = await checkToken(token)
  if(!isValidToken) {
    res.status(400).send({message: "unauthorized"});
    return;
  } else {
    next()
  }
})

router.get('/', async (req: Request, res: Response) => {
  let mysqlData 
  const {searchName} = req.query
  if(searchName) {
    mysqlData = await selectFromDatabase('SELECT * FROM students WHERE Fullname LIKE ? ORDER BY id DESC', [`%${searchName}%`]);
  } else {
    mysqlData = await selectFromDatabase('SELECT * FROM students order by id desc')
  }
  res.send({"data":mysqlData, "count": mysqlData.length});
});

router.post('/add', async (req: Request, res: Response) => {
  const {Fullname, date} = req.body
  if(!Fullname || !date) {
    res.status(404).send({message: "not valid data"});
    return;
  }

  if(typeof Fullname !== 'string') {
    res.status(404).send({message: "inccorect form"});
    return;
  }

  try {
    await runQuery('INSERT INTO students (Fullname, date) VALUES (?, ?)', [Fullname, date]);
} catch (error) {
  throw error
}
  res.status(202).send({message: "user created"});
});

router.delete('/remove/:id', async (req: Request, res: Response) => {
  const {id} = req.params

  const mysqlData = await selectFromDatabase('SELECT * FROM students where id = ?', [id])
  if (!mysqlData.length) {
    res.status(404).send({ message: "Item not found" });
    return
  }

  try {
    await runQuery('delete from students where id = ?', [id]);
} catch (error) {
  throw new Error('Failed to delete the user');
}


  res.status(202).send({message: "user deleted"});
});

router.put('/edit/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { Fullname, date } = req.body;

  const mysqlData = await selectFromDatabase('SELECT * FROM students where id = ?', [id])
  if (!mysqlData.length) {
    res.status(404).send({ message: "Item not found to update" });
    return
  }

  if (!Fullname || !date) {
    res.status(404).send({ message: 'not valid data' });
    return
  }


  try {
    await runQuery('UPDATE students SET Fullname = ?, date = ? WHERE id = ?', [Fullname, date, id]);
} catch (error) {
  throw error
}

  res.status(200).send({
    message: 'Item updated successfully'
  });
});




