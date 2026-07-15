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



export const postServices = {
     createPostDB
}

