import express from "express";
import * as type from "../interface";
import { UserServices } from "../services/user.Service";

export const user = {

  createUser :async (req: express.Request, res: express.Response, next :express.NextFunction) => {
    const data: type.user = req.body;
    try {
      const user = await UserServices.createUser(data);
      res.status(200).json(user);
    }
    catch(error){
      next(error)
    }
  
  },

  verifyOtp :async (req: express.Request, res: express.Response, next :express.NextFunction) => {
    const data: type.otpData = req.body;
    try {
      const verifyOtp = await UserServices.verifyOtp(data);
      res.status(200).json(verifyOtp);
    }
    catch(error){
      next(error)
    }
  
  },

  login  :async (req: express.Request, res: express.Response, next :express.NextFunction) => {
    const data = req.body;
    try {
      const user = await UserServices.loginUser(data);
      res.status(200).json(user);
    }
    catch(error){
      next(error)
    }
  
  }

}