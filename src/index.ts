import express, { Express, Request, Response , Application } from 'express';
import cors from "cors"
import dotenv from 'dotenv';
import { router as studentsRouter } from './routes/students';
import { router as authorizations } from './routes/authorizations'

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
app.use("/students", studentsRouter)
app.use("/", authorizations)



app.get("/", async (req: Request, res: Response) => {
  res.status(200).send({"message": "Welcome to test automation"})
})

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});