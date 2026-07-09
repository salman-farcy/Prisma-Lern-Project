import httpStatus from 'http-status';

import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";

declare global {
     namespace Express {
          interface Request {
          user?:{
               email: string;
               name: string;
               id: string;
               role: Role;
          }
     }
     }
}

const router = Router();

router.post("/register", userController.registerUser)
router.get("/me", (req: Request, res: Response, next: NextFunction) => {
     // res.status(200).json({
     //      success: true,
     //      statusCode: 200,
     //      message: "User Profile Retrieved Successfully",
     // })
     console.log(req.cookies)

     const { accessToken } = req.cookies;
     const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);


     if (typeof verifiedToken === "string") {
          throw new Error(verifiedToken);
     }

     const { email, name, id, role } = verifiedToken;
     const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];

     if(!requiredRoles.includes(role)){
          return res.status(403).json({
               success: false,
               statusCode: httpStatus.FORBIDDEN,
               message: "Forbidden You don't have permissinon to access this resource."
          })
     }

     req.user = {
          email,
          name, 
          id, 
          role,
     };


     next();

}, userController.getMyProfile)

export const userRouter = router;