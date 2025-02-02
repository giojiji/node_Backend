import { Request, Response  } from 'express';
import validator from 'validator';
import { insertUserData, selectUserDataByEmail, selectUserDataById, selectUserDataByMobile, updateIsAuthorized, updatePassword } from '../models/auth';
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
import { sendRegistrationEmail, sendresetEmail } from '../util/emailHelper';
import generator from "generate-password"
import  jwt from 'jsonwebtoken';
import { sendPasswordOnMobile } from '../util/smsHelper';

interface RequestType extends Request {
  userId?: string;
  email?: string
}

// 201: Created
// 400: Bad Request
// 404: Not Found
// 401: Unauthorized
// 500: Internal Server Error

//For env File 

dotenv.config();


export const registerUser  = async (req: Request, res: Response) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  if(!firstName || !lastName || !email || !mobile || !password) {
    res.status(400).send({message: "invalid data"})
    return
  }

  if (!validator.isEmail(email)) {
    res.status(400).send({ message: "invalid email format" });
    return;
  }
  const hashPassword = await bcrypt.hash(password, 12)
  try {
    await insertUserData(firstName, lastName, email, mobile, hashPassword)
    res.status(201).send({message: "success"})
    const newUser =  await selectUserDataByEmail(email)
    await sendRegistrationEmail(email, newUser.id );
    return
  }
  catch (err) {
      res.status(400).send({message: err})
      return
  }

};

export const loginUser  = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if(!email || !password) {
      res.status(400).send({message: "invalid data"})
      return
    }

    const userData = await selectUserDataByEmail(email)
    if(!userData) {        
        res.status(404).send({message: "user not found"})
        return
    }
    const checkHashPassword = await bcrypt.compare(password, userData.password)
    if(!checkHashPassword) {
      res.status(404).send({message: "inccorect password"})
      return
    } else {
      const token = jwt.sign({
        email: userData.email,
        id: userData.id
      }, 
      process.env.JWT_SECRET!, 
      {expiresIn: '1h'}
    )
      res.send({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        mobile: userData.mobile,
        date: userData.date,
        token: token,
        hasPhoto: userData.hasPhoto,
        imageUrl: userData.imageUrl
    })
      return
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
  const {id} = req.params

  const userData = await selectUserDataById(id)

  if(!userData) {
    // res.status(404).send({message: "invalid user id"})
    res.status(404).render("verifyEmail", { status: "error", name: "" });
    return
  }
  if(!userData.isAuthorized) {
    await updateIsAuthorized(id)
    // res.status(201).send({message: "email is verified successfully"})
    res.status(201).render("verifyEmail", { status: "success", name: userData.email });
    return
  } else {
    // res.status(404).send({message: "email is already verified"})
    res.status(200).render("verifyEmail", { status: "already_verified", name: userData.email });
    return
  }
  
}

export const resetPassword = async (req: RequestType, res: Response) => {
  const email = req.body.email
  
  if(!email) {
    res.status(400).send({message: "invalid data"})
    return
  }

  const userData = await selectUserDataByEmail(email)
  if(!userData) {        
    res.status(404).send({message: "user not found"})
    return
  }

  const randomPassword = generator.generate({
    length: 10,
    numbers: true
  })

  const hashPassword = await bcrypt.hash(randomPassword, 12)

  try {
    await updatePassword(hashPassword, userData.id)
    res.status(201).send({ message: "Password has been updated successfully" });
    await sendresetEmail(randomPassword, email);
    return
  }
  catch (err) {
      res.status(400).send({message: err})
      return
  }
  
}

export const changePassword = async (req: RequestType, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req?.userId

  if(!oldPassword || !newPassword) {
    res.status(400).send({message: "invalid data"})
    return
  }
 
  const userData = await selectUserDataById(userId)
  if(!userData) {        
    res.status(404).send({message: "user not found"})
    return
  }

  const checkHashPassword = await bcrypt.compare(oldPassword, userData.password)
  if(!checkHashPassword) {
    res.status(404).send({message: "inccorect password"})
    return
  } else { 
    const hashPassword = await bcrypt.hash(newPassword, 12)
    try {
      await updatePassword(hashPassword, userId)
      res.status(201).send({ message: "Password has been updated successfully" });
      return
    }
    catch (err) {
        res.status(400).send({message: err})
        return
    }
  }

}

export const smsResetPassword = async (req: Request, res: Response) => {
    const {mobile} = req.body
    if(!mobile) {
        res.status(400).send({message: "invalid data"})
        return
    }
    const userData = await selectUserDataByMobile(mobile)
    if(!userData) {        
      res.status(404).send({message: "user not found"})
      return
    }
  
    const randomPassword = generator.generate({
      length: 10,
      numbers: true
    })
    const hashPassword = await bcrypt.hash(randomPassword, 12)

    try {
        await updatePassword(hashPassword, userData.id)
        const message = await sendPasswordOnMobile(mobile, randomPassword);
        res.status(201).json({ message: "SMS sent successfully", data: message });
        return
    } catch (error) {
        res.status(400).json({ error: "Failed to send SMS", details: error });
        return
    }
}


