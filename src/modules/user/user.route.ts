import { catchAsync } from './../../utils/catchAsync';
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from '../../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';

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

const auth = (...requiredRole : Role[]) =>{
     return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
          const token = req.cookies.accessToken 
          // || req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;

          if(!token) {
               throw new Error("You are not logged in. Please log in to access this rosource.")
          }

          const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret)

          if(!verifiedToken.success){
               throw new Error(verifiedToken.error);
          }

          const { email, name, id, role } = verifiedToken.data as JwtPayload;
          
          if(requiredRole.length && !requiredRole.includes(role)){
               throw new Error("Forbidden. You dont't have Permission to access this resource.")
          }

          const user = await prisma.user.findUnique({
               where: {
                    email, 
                    name, 
                    id, 
                    role
               }
          })

          if(!user){
               throw new Error("User not found. Please Login again.");
          }

          if(user.activeStatus === "BLOCKED"){
               throw new Error("Your account been blocked. Please Contact support.")
          }

          req.user = {
               email, 
               name,
               id,
               role
          }
          next()
     });
};

router.get("/me", 
//      (req: Request, res: Response, next: NextFunction) => {
//      // res.status(200).json({
//      //      success: true,
//      //      statusCode: 200,
//      //      message: "User Profile Retrieved Successfully",
//      // })
//      console.log(req.cookies)

//      const { accessToken } = req.cookies;
//      const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

//      if(!verifiedToken?.success){
//           throw new Error(verifiedToken.error)
//      }
     

//      const { email, name, id, role } = verifiedToken;
//      const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];

//      if(!requiredRoles.includes(role)){
//           return res.status(403).json({
//                success: false,
//                statusCode: httpStatus.FORBIDDEN,
//                message: "Forbidden You don't have permissinon to access this resource."
//           })
//      }

//      req.user = {
//           email,
//           name, 
//           id, 
//           role,
//      };


//      next();

// }
auth(Role.ADMIN, Role.AUTHOR, Role.USER) , userController.getMyProfile)

export const userRouter = router;