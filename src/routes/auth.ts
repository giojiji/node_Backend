import express from "express";
import { loginUser, registerUser } from "../controllers/auth";


export const router = express.Router();


router.post("/register", registerUser);

router.post("/login", loginUser);
