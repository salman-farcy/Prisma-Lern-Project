import httpStatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from './user.services';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";




const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const payload = req.body;

     const user = await userService.registerUserIntoDB(payload)
     
     sendResponse(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "User Registered successfully!",
          data: {
               user
          }
     })
})

const getMyProfile = catchAsync(async (req: Request , res: Response, next: NextFunction) => {
     // const {accessToken} = req.cookies;
     // console.log(req.user, "user request")
     // const verifiedToken =  jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
     
     // if(typeof verifiedToken === "string"){
     //      throw new Error(verifiedToken);
     // }

     const profile = await userService.getMyProfileFromDB(req.user?.id as string);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User profile Fetched successfully",
          data: {profile}
     })
     
})


export const userController = {
     registerUser,
     getMyProfile
}