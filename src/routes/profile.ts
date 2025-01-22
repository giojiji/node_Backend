import express from 'express';
import { deleteUserPhoto, getSelf, uploadUserPhoto } from '../controllers/profile';
import { isAuth } from '../middleware/is-auth';
import { uploadProfilePicture } from '../util/uploadHelper';



export const router = express.Router()


router.get('/self/:id', isAuth, getSelf);

router.post('/uploadPhoto/:id', isAuth, uploadProfilePicture, uploadUserPhoto);

router.delete('/deletePhoto/:id', isAuth, deleteUserPhoto);

