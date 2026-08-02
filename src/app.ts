import httpStatus from 'http-status';
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.routes";
import { postRouter } from "./modules/post/post.router";
import { commentRouter } from "./modules/comment/comment.router";
import { notFound } from "./middlewares/notfound";
import { globalErrorHandler } from './middlewares/globalErrorHandller';

const app: Application = express();
app.use(cors({
     origin: config.app_url,
     credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
     res.send("Hello World!");
})


app.use("/api/user", userRouter)
app.use("/api/user", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)

// app.use((req: Request, res: Response) => {
//      res.status(404).json({
//           message: "Route not found",
//           path: req.originalUrl,
//      });
// });

app.use(notFound);

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//           success: false,
//           statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//           message: err.message || "Internal Server Error",
//           error: err
//      });
// })

app.use(globalErrorHandler);



export default app;