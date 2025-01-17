import { Request, Response  } from 'express';
import validator from 'validator';
import { insertUserData, selectUserData } from '../models/auth';
import bcrypt from 'bcryptjs'
import nodemailer from "nodemailer"
import dotenv from 'dotenv';


// 201: Created
// 400: Bad Request
// 404: Not Found
// 401: Unauthorized
// 500: Internal Server Error

//For env File 

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
  user: "giojiji923test@gmail.com",
  pass: process.env.GMAILPASS
  }
  });

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
    const mailOptions = {
      from: 'node.js <gio-jiji-node@gmail.com>',
      to: email,
      subject: 'Congratulations!',
      text: "Registration successful - start your journey with us"
      }
    transporter.sendMail(mailOptions, (err) => {
      if(err) {
        console.log(err)
      }
    })
  }
  catch (err) {
      res.status(400).send({message: err})
  }

};

export const loginUser  = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if(!email || !password) {
      res.status(400).send({message: "invalid data"})
      return
    }

    const userData = await selectUserData(email)
    if(!userData) {        
        res.status(404).send({message: "user not found"})
        return
    }
    const checkHashPassword = await bcrypt.compare(password, userData.password)
    if(!checkHashPassword) {
      res.status(404).send({message: "inccorect password"})
      return
    } else {
      res.send({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        mobile: userData.mobile,
        date: userData.date,
        token: userData.token
    })
      return
    }
}