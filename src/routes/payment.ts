import express from "express";
import {  buyProduct, getOrder } from "../controllers/payment";
import { isAuth } from "../middleware/is-auth";


export const router = express.Router();


router.post("/pay", isAuth, buyProduct);

router.get("/orders/:session_id", isAuth, getOrder);







