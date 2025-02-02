import { Request, Response  } from 'express';
import { selectProducts } from '../models/products';


export const getProducts  = async (req: Request, res: Response) => {
  const {name} = req.query
  const data = await selectProducts(name?.toString());
  res.send({"data":data, "count": data.length});
};