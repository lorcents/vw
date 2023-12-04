import express from "express";
import * as type from "../interface";
import { UserServices } from "../services/user.Service";

export const user = {

  createUser :async (req: express.Request, res: express.Response, next :express.NextFunction) => {
    const data: type.user = req.body;
    try {
      const wallet = await UserServices.createUser(data);
      res.status(200).json(wallet);
    }
    catch(error){
      next(error)
    }
  
  },

}