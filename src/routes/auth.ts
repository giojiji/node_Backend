import express from "express";
import { loginUser, registerUser, verifyEmail, resetPassword, changePassword, smsResetPassword } from "../controllers/auth";
import { isAuth, isAuthorized } from "../middleware/is-auth";


export const router = express.Router();


router.post("/register", registerUser);

router.post("/login", isAuthorized, loginUser);

router.post("/reset-password", resetPassword);

router.get("/verifyEmail/:id", verifyEmail);

router.put("/change-password", isAuth, changePassword);

router.post("/sms-reset-password", smsResetPassword);






