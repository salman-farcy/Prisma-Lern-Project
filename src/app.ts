import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response  } from "express";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";


const app: Application = express();
app.use(cors({
     origin: config.app_url,
     credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get("/", (req: Request, res: Response) => {
     res.send("Hello World!");
})


app.post("/api/users/register", async (req : Request, res : Response) => {
     const {name, email, password} = req.body;
     
     
     res.status(httpStatus.CREATED).json({ message: "User registered successfully!"
     })
})



export default app;