import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router()


router.post("/", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.createComment);


router.get("/author/:autorId", commentController.getCommentByAuthorId);


router.get("/:commentId", commentController.getCommentByAuthorId);


router.patch("/:commentId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.updateComment);


router.delete("/:commentId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.deleteComment);


router.put("/:commentId/moderate", auth(Role.ADMIN), commentController.moderateComment);


export const commentRouter = router