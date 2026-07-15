import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postServices } from "./post.services";
import { sendResponse } from "../../utils/sendResponse";



const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const id = req.user?.id;
     const payload = req.body;

     const postResult = await postServices.createPostDB(payload, id as string)

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "Post Created Successfully",
          data: postResult 
     })
});


const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     

});

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


});


const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


});


const upDatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


});

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


});


export const postController = {
     createPost,
     getAllPosts,
     getPostStats,
     getPostById,
     upDatePost,
     deletePost
}