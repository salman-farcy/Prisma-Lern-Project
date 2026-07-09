import  httpStatus  from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const loginUser = catchAsync(async (req, res, next) => {
     const payload = req.body;
     const {accessToken, refreshToken} = await authService.loginUserDB(payload);

     res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24 //24 hour / 1 day
     })

     res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24 * 7 // 7 day
     })

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User Logged In Successfully",
          data: {accessToken, refreshToken}
     })
}) 


export const authControler = {
     loginUser
}