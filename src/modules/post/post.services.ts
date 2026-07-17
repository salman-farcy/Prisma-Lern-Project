import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface"



const createPostDB = async (payload: ICreatePostPayload, userId: string) => {
     const result = await prisma.post.create({
          data: {
               ...payload,
               authorId: userId
          }
     });
     return result;
}


const getAllPostsDB = async () => {
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


const getPostByIdDB = async (postId: string) => {
     // await prisma.post.update({
     //      where: {
     //           id: postId
     //      },

     //      data: {
     //           views: {
     //                increment: 1
     //           }
     //      },
     // });

     // const post = await prisma.post.findUniqueOrThrow({
     //      where: {
     //           id: postId
     //      },

     //      include: {
     //           author: {
     //                omit: {
     //                     password: true
     //                }
     //           },
     //           comments: {
     //                where: {
     //                     status: CommentStatus.APPROVED
     //                },

     //                orderBy: {
     //                     createdAt: "desc"
     //                }
     //           },

     //           _count: {
     //                select: {
     //                     comments: true
     //                }
     //           }
     //      }
     // })

     // return post
     const transactionResult = await prisma.$transaction(
          async (tx) => {
               await tx.post.update({
                    where: {
                         id: postId
                    },

                    data: {
                         views: {
                              increment: 1
                         }
                    },
               });
               
               const post = await tx.post.findUniqueOrThrow({
                    where: {
                         id: postId
                    },

                    include: {
                         author: {
                              omit: {
                                   password: true
                              }
                         },
                         comments: {
                              where: {
                                   status: CommentStatus.APPROVED
                              },

                              orderBy: {
                                   createdAt: "desc"
                              }
                         },

                         _count: {
                              select: {
                                   comments: true
                              }
                         }
                    }
               });

               return post
          }
     );

     return transactionResult;
}


const getMyPostsDB = async (authorId: string) => {
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


const updatePostDB = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
     const post = await prisma.post.findUniqueOrThrow({
          where: {
               id: postId
          }
     });

     if (!isAdmin && post.authorId !== authorId) {
          throw new Error("You are not the woner of this post!")
     };

     const result = await prisma.post.update({
          where: {
               id: postId
          },
          data: payload,
          include: {
               author: {
                    omit: {
                         password: true
                    }
               },
               comments: true
          }
     });

     return result;
}


const deletePost = async (postId: string, authorId: string, isAdmin: any) => {
     const post = await prisma.post.findUnique({
          where: {
               id: postId
          }
     });

     if (!post) {
          throw new Error("Post not found");
     }

     if (!isAdmin && post.authorId !== authorId) {
          throw new Error("You are not the owner of this post!");
     }

     await prisma.post.delete({
          where: {
               id: postId
          }
     });
}


export const postServices = {
     createPostDB,
     getAllPostsDB,
     getPostByIdDB,
     getMyPostsDB,
     updatePostDB,
     deletePost
}

