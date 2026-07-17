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
     const result = await postServices.getAllPostsDB();
     
     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Post Retrieved Successfully",
          data: result 
     })

});

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


});


const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const authorId = req.user?.id
     const result = await postServices.getMyPostsDB(authorId as string)

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "My Posts Retrieved Successfuly",
          data: result
     })

});



const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const postId = req.params.postId;

     if(!postId){
          throw new Error("Post Id Required In Params")
     }

     const result = await postServices.getPostByIdDB(postId as string)

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Post retrieved successfully",
          data: result
     });
});


const upDatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const postId = req.params.postId;
     const payload = req.body;
     const authorId = req.user?.id;
     const isAdmin = req.user?.role === "ADMIN";

     const result = await postServices.updatePostDB(postId as string, payload, authorId as string, isAdmin)

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Post Updated Successfully",
          data: result
     })
});

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const postId = req.params.postId;
     const authorId = req.user?.id;
     const isAdmin = req.user?.role === "ADMIN";

     if(!postId){
          throw new Error("Post Id Required In Params")
     }

     await postServices.deletePost(postId as string, authorId as string, isAdmin);

     sendResponse(res, {
          success: true, 
          statusCode: httpStatus.OK,
          message: "Post delete successfully",
          data: null
     })
});


export const postController = {
     createPost,
     getAllPosts,
     getPostStats,
     getMyPosts,
     getPostById,
     upDatePost,
     deletePost
}