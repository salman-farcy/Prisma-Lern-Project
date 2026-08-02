import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload,  IPostQuery,  IUpdatePostPayload } from "./post.interface"



const createPostDB = async (payload: ICreatePostPayload, userId: string) => {
     const result = await prisma.post.create({
          data: {
               ...payload,
               authorId: userId
          }
     });
     return result;
}



const getAllPostsDB = async (query : IPostQuery) => {

     const limit = query.limit ? Number(query.limit) : 10;
     const page = query.page ? Number(query.page) : 1;
     const skip = (page - 1) * limit;

     const sortBy = query.soryBy ? query.soryBy : "createdAt";
     const sortOrder = query.sortOrder ? query.sortOrder : "desc";

     const posts = await prisma.post.findMany(
          {
               //* filtering / Exact match without AND Oprator
               // where: {
               //      title: "salman farcy new Post",
               //      content: "sikha kathamo nia onack kz kora dorkar"
               // },

               //* filtering / Exact match With AND Oprator 
               // where: {
               //      AND: [
               //           {
               //                title: "salman farcy new Post"
               //           },
               //           {
               //                content: "sikha kathamo nia onack kz kora dorkar"
               //           },
               //           {
               //                tags: {
               //                     equals: [
               //                          "Typescript",
               //                          "prisma",
               //                          "express"
               //                     ]
               //                }
               //           }
               //      ]
               // },

               //* Searching / Partial match
               // where: {
               //      title: {
               //           contains: "JoR",
               //           mode: "insensitive"
               //      },

               //      content: "ai jor tufan ar modhe exm nao ta akdome thik hoy nay "
               // },

               // searchin / partial search with OR oprator
               // where: {
               //      OR: [
               //           {
               //                title: {
               //                     contains: "2025",
               //                     mode: "insensitive"
               //                }
               //           },
               //           {
               //                content: {
               //                     contains: "sikha kathamo",
               //                     mode: "insensitive" 
               //                }
               //           }
               //      ]
               // },

               // where: {
               //      //* filtering & searching
               //      AND: [
               //           {
               //                //? searching
               //                OR: [
               //                     {
               //                          title: {
               //                               contains: "2025",
               //                               mode: "insensitive"
               //                          }
               //                     },
               //                     {
               //                          content: {
               //                               contains: "sikha",
               //                               mode: "insensitive"
               //                          }
               //                     }
               //                ]
               //           },

               //           //* filtering
               //           {
               //                title: "2025"
               //           },

               //           {
               //                content: "sikha"
               //           }
               //      ]
               // },
                 
               //*pagination
               // take: 1,
               // skip: 3,

               // * Sorting / OrderBy
               // orderBy: {
               //      createdAt: "desc",
               //      title: "asc",
               //      content: "desc"
               // },


               where: {
                    AND: [
                         //
                         query.searchTerm ? {
                                   OR: [
                                        {
                                             title : {
                                                  contains: query.searchTerm,
                                                  mode: "insensitive"
                                             },
                                             
                                        },
                                        {
                                             content : {
                                                  contains: query.searchTerm,
                                                  mode: "insensitive"
                                             },
                                        },
                                   ]
                         } : {},


                         //title filtering
                         query.title ? {
                                   title: query.title,
                                   mood: "insensitive"
                              } : {},

                         //content filtering
                         query.content ? {
                                   content: query.content,
                                   mood: "insensitive"
                              } : {},
                    ]
               },


               take: limit,
               skip: skip,

               orderBy: {
                    // sorting by : sortOrder
                    [sortBy] : sortOrder
               },

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


const getPostStats = async () => {
     const transactionResult = await prisma.$transaction(
          async (tx) => {
               // const totalPosts = await tx.post.count();

               // const totalPublishedPosts = await tx.post.count({
               //      where: {
               //           status: PostStatus.PUBLISHE
               //      }
               // });

               // const totalDraftPosts = await tx.post.count({
               //      where: {
               //           status: PostStatus.DRAFT
               //      }
               // });

               // const totalArchivedPosts = await tx.post.count({
               //      where: {
               //           status: PostStatus.ARCHIVED
               //      }
               // });

               // const totalComments = await tx.comment.count({
               //      where: {
               //           status: CommentStatus.APPROVED
               //      }
               // });

               // const totalApprovedComments = await tx.comment.count({
               //      where: {
               //           status: CommentStatus.APPROVED
               //      }
               // });

               // const totalRejectedComments = await tx.comment.count({
               //      where: {
               //           status: CommentStatus.REJECT
               //      }
               // });

               // const totalPostViewsAggregate = await tx.post.aggregate({
               //      _sum: {
               //           views: true
               //      }
               // })

               // const totalPostViews = totalPostViewsAggregate._sum.views;

               // return {
               //      totalPosts,
               //      totalPublishedPosts,
               //      totalDraftPosts,
               //      totalArchivedPosts,
               //      totalComments,
               //      totalApprovedComments,
               //      totalRejectedComments,
               //      totalPostViews
               // }

               const [
                    totalPosts,
                    totalPublishedPosts,
                    totalDraftPosts,
                    totalArchivedPosts,
                    totalComments,
                    totalApprovedComments,
                    totalRejectedComments,
                    totalPostViews
               ] = await Promise.all([
                    await tx.post.count(),

                    await tx.post.count({
                         where: {
                              status: PostStatus.PUBLISHE
                         }
                    }),

                    await tx.post.count({
                         where: {
                              status: PostStatus.DRAFT
                         }
                    }),

                    await tx.post.count({
                         where: {
                              status: PostStatus.ARCHIVED
                         }
                    }),

                    await tx.comment.count(),

                    await tx.comment.count({
                         where: {
                              status: CommentStatus.APPROVED
                         }
                    }),

                    await tx.comment.count({
                         where: {
                              status: CommentStatus.REJECT
                         }
                    }),

                    await tx.post.aggregate({
                         _sum: {
                              views: true
                         }
                    })
               ]);

               return {
                    totalPosts,
                    totalPublishedPosts,
                    totalDraftPosts,
                    totalArchivedPosts,
                    totalComments,
                    totalApprovedComments,
                    totalRejectedComments,
                    totalPostViews
               }

          }

     );

     return transactionResult;
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
     deletePost,
     getPostStats
}

