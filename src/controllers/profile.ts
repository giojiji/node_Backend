import { Request, Response  } from 'express';
import { selectMyOrders, selectUserProfile, updateUserPhotoState } from '../models/profile';
import path from 'path';
import fs from 'fs';
import { selectUserDataById } from '../models/auth';

export interface RequestType extends Request {
  userId?: string;
}



export const getSelf  = async (req: Request, res: Response) => {
    const {id} = req.params
    const userData = await selectUserProfile(id);
    res.send(userData);
    return
};


export const uploadUserPhoto  = async (req: Request, res: Response) => {
    const {id} = req.params
    const fullPath = req.file?.path; 
    const relativeImageUrl = fullPath && path.relative('src/public', fullPath.replace(/\\/g, '/'));
    await updateUserPhotoState(true, id, relativeImageUrl);
    res.send({message: "Photo has uploaded"});
    return
};


export const deleteUserPhoto  = async (req: Request, res: Response) => {
    const {id} = req.params
    const userData = await selectUserDataById(id)
    const filePath = `src/public/${userData.imageUrl}`;
    fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error removing file: ${err}`);
          return;
        }      
      });
    await updateUserPhotoState(false, id, null);
    res.send({message: "Photo has deleted"});
    return
};



export const getMyOrders  = async (req: RequestType, res: Response) => {
  const userId = req.userId
  if(!userId) {
    res.status(404).send({message: "invalid id"});
    return
  }
  try {
    const data = await selectMyOrders(userId);
    res.send({"data": data, "count": data.length});
    return
  }
  catch (error) {
    res.status(404).send({message: error});
    return
  }

};



