import {  PrismaClient, User } from "@prisma/client";
import * as type from "../interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export abstract class UserServices {
    static async createUser(data: type.user): Promise<User> {
        if(!data) throw new Error("Please provide valid data");
        try {
    
          const existingUser = await prisma.user.findUnique({
            where: { phoneNumber: data.phoneNumber },
          });
      
          if (existingUser) {
            throw new Error(`Wallet already exists for phone Number: ${data.phoneNumber}`);
          }
          const result = await prisma.user.create({
            data: {
              firstName: data.firstName,
              secondName:data.phoneNumber,
              email : data.email,
              status: true,
              phoneNumber:data.phoneNumber
            },
          });
          return result;
        } catch (err: any) {
          throw new Error( `Failed to create wallet : ${err.message}`);
        }
      }

    }