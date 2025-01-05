import express, { Express, Request, Response, Application } from "express";
import { runQuery, selectFromDatabase } from "../db";


export const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;
  if(!firstName || !lastName || !email || !mobile || !password) {
    res.status(400).send({message: "invalid data"})
    return
  }
  try {
    await runQuery(
      "insert into users (firstName, lastName, email, mobile, password, token) values (?, ?, ?, ?, ?, UUID())",
      [firstName, lastName, email, mobile, password]
    );
    res.send({message: "success"})
  }
  catch (err) {
      res.status(400).send({message: err})
  }

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if(!email && !password) {
      res.status(400).send({message: "invalid data"})
      return
    }
    const userData = await selectFromDatabase(
      "select * from users where email = ? and password = ?", [email, password]
    );
    if(!userData.length) {        
        res.status(400).send({message: "user not found"})
        return
    }
    res.send(userData[0])
});
