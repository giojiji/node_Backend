import { Request, Response , NextFunction } from 'express';
import { selectFromDatabase } from '../util/db';

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if(!token) {
    res.status(401).send({message: "unauthorized"});
  } else {
    const isValidToken = await selectFromDatabase('select token from users where token = ?', [token])
    if(!isValidToken.length) {
        res.status(401).send({message: "unauthorized"});
        return;
    } else {
        next()
    }
  }
}