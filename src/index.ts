import express, { Request, Response , Application } from 'express';
import cors from "cors"
import dotenv from 'dotenv';
import { router as studentsRouter } from './routes/students';
import { router as authRouter } from './routes/auth'
import { router as profileRouter } from './routes/profile'
import path from "path";


// 201: Created
// 400: Bad Request
// 404: Not Found
// 401: Unauthorized
// 500: Internal Server Error

//For env File 
dotenv.config();


const app: Application = express();
const port = process.env.PORT || 8000;
app.use(cors())
app.use(express.json());


const __dirname = path.resolve();


app.use(express.static(path.join(__dirname, "src" , 'public')))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));


app.use("/", authRouter)

app.use("/", profileRouter)

app.use("/students", studentsRouter)

app.get("/", async (req: Request, res: Response) => {
  res.status(200).send({"message": "Welcome to test automation"})
})



app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});