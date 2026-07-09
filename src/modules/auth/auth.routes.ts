import { Router } from "express";
import { authControler } from "./auth.controller";


const router = Router();


router.post("/login", authControler.loginUser);


export const authRouter = router