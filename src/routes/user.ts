import express from "express";

import { user } from "../controllers/user";

const userRouter = express.Router();

userRouter.post("/create-user", user.createUser);


export default userRouter;