import express from "express";
import {  getProducts } from "../controllers/products";
// import { isAuth } from "../middleware/is-auth";


export const router = express.Router();


router.get("/products", getProducts);








