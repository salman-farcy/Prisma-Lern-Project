import { Router } from "express";
import { authControler } from "./auth.controller";

const router = Router();


router.post("/login", authControler.loginUser);
router.post("/refresh-token", authControler.refreshToken);


export const authRouter = router