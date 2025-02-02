import { Request, Response , NextFunction } from 'express';
import { selectFromDatabase } from '../util/db';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

interface RequestType extends Request {
  userId?: string;
  email?: string;
}

dotenv.config();


export const isAuth = async (req: RequestType, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization')
  if(!authHeader) {
    res.status(401).send({message: "unauthorized"});
    return
  }
  const token = req.get('Authorization')?.split(" ")[1]
  if(!token) {
    res.status(401).send({message: "unauthorized"});
    return
  }
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET!)
  } catch (err) {
    res.status(401).send({err});
    return
  }
  if(!decodedToken) {
    res.status(401).send({message: "Not authenticated"});
    return
  }
  req.userId = decodedToken.id
  req.email = decodedToken.email
  next()
}


export const isAuthorized  = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if(!email) {
    res.status(401).send({message: "email is required"});
  } else {
    const userIsAuthorized = await selectFromDatabase('select isAuthorized from customers where email = ?', [email])
    if(!userIsAuthorized.length) {
      res.status(401).send({message: "inccorect email"});
      return;
    }
    if(!userIsAuthorized[0].isAuthorized) {
        res.status(401).send({message: "email is not verified"});
        return;
    } else {
        next()
    }
  }
}

