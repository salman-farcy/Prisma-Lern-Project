import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"



const createPostDB = async (payload: ICreatePostPayload, userId: string) => {
      const result = await  prisma.post.create({
          data: {
               ...payload,
               authorId: userId
          }
      });
      return result;
}


const getAllPostsDB = async () =>{
     const posts = await prisma.post.findMany(
          {
               include: {
                    author: {
                         omit: {
                              password: true
                         }
                    },
                    comments: true
               },
               
          }
     );
     return posts
}


const getPostByIdDB = async (postId: string) =>{

     const post = await prisma.post.findUniqueOrThrow({
          where: {
               id: postId
          }
     });

     const updatedPost = await prisma.post.update({
          where: {
               id: postId
          },

          data: {
               views: {
                    increment : 1
               }
          },

          include: {
               author: {
                    omit: {
                         password: true
                    }
               },
               comments: true
          }
     })
     return updatedPost
}


const getMyPostsDB = async (authorId: string) =>{
     const result = await prisma.post.findMany({
          where: {
               authorId
          },

          orderBy: {
               createdAt: "desc"
          },

          include: {
               author: {
                    omit: {
                         password: true
                    }
               },
               _count: {
                    select: {
                         comments: true
                    }
               }
          
          }
     });

     return result
}


export const postServices = {
     createPostDB,
     getAllPostsDB,
     getPostByIdDB,
     getMyPostsDB
}

