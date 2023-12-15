import express from "express";

import { user } from "../controllers/user";

const userRouter = express.Router();

userRouter.post("/create-user", user.createUser);

userRouter.post("/login",user.login)

userRouter.post("/verify-otp", user.verifyOtp);


export default userRouter;