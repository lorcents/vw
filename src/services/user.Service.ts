import {  PrismaClient, User } from "@prisma/client";
import * as type from "../interface";
import { generateRandomSixDigitNumber,addMinutesToDate } from "../util/util";
import { AppError } from "../middleware";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPWhatsapp } from "./otp.Service";
import { JwtSecret } from "../../config";

const prisma = new PrismaClient();

export abstract class UserServices {
    static async createUser(data: type.user): Promise<string> {
        if(!data) throw new Error("Please provide valid data");
        try {
    
          const existingUser = await prisma.user.findUnique({
            where: { phoneNumber: data.phoneNumber },
          });
      
          if (existingUser) {
            throw new Error(`Wallet already exists for phone Number: ${data.phoneNumber}`);
          }

    //Generate OTP
    const otp = generateRandomSixDigitNumber();
    const hashedOtp = await bcrypt.hash(otp, 10);
          const result = await prisma.user.create({
            data: {
              firstName: data.firstName,
              secondName:data.secondName,
              email : data.email,
              status: true,
              phoneNumber:data.phoneNumber,
              otpHash : hashedOtp,
              otpExpiresAt: addMinutesToDate(10)  //Expires after 10 minutes
            },
          });
          //Send OTP
       await sendOTPWhatsapp(otp ,result.phoneNumber);

          return `A one time otp has been send to ${result.phoneNumber}  whatsapp Account`;
        } catch (err: any) {
          throw new Error( `Failed to create wallet : ${err.message}`);
        }
      }


      static async verifyOtp (data :{otp : string, phoneNumber : string}) : Promise <any> {
        const existingUser = await prisma.user.findUnique({
          where: { phoneNumber: data.phoneNumber },
        });
    
        if (existingUser == null || existingUser == undefined) {
          throw new Error(`Wallet doesn't exists for phone Number: ${data.phoneNumber}`);
        }
        if (!existingUser.otpHash){
          throw new Error('OTP not found for this user')
        }

        //compare the otp 
        const isPinCorrect = await bcrypt.compare(data.otp, existingUser.otpHash);
        if (!isPinCorrect) {
          await prisma.user.update({where :{
            phoneNumber : data.phoneNumber
          },data :{
            inCorrectAttempts : existingUser.inCorrectAttempts! + 1
          }})
        throw new Error ('Incorrect OTP provided')
        }

        //check if otp has expired 
        console.log(new Date());
        console.log(existingUser.otpExpiresAt);

        if (new Date() > existingUser.otpExpiresAt!) throw new Error('Provided OTP has already expired');

        //If all is well create an json web token 
        // Generate JWT token upon successful OTP verification
        const jwtData = {
          phoneNumber:existingUser.phoneNumber,
          firstName : existingUser.firstName,
          time: new Date()
        }
    const token = jwt.sign( jwtData , JwtSecret!, { expiresIn: '24h' });

    // You can include additional data in the token payload if needed
    return({ token });
      }

      static async loginUser(data :{phoneNumber:string}){
        if(!data) throw new AppError(400,'please provide a phone Number')
        const existingUser = await prisma.user.findUnique({
          where: { phoneNumber: data.phoneNumber },
        });
        if (!existingUser) throw new AppError(400,`No user found with ${data.phoneNumber} phone number` );
        //Generate OTP
     const otp = generateRandomSixDigitNumber();
     const hashedOtp = await bcrypt.hash(otp, 10);
     
     try{
      const result = await prisma.user.update(
        {
          where :{ phoneNumber : existingUser.phoneNumber},
          data:{
            otpHash:hashedOtp,
            otpExpiresAt:addMinutesToDate(10)
          }

        }

      )
      await sendOTPWhatsapp(otp ,result.phoneNumber);

      return `A one time otp has been send to ${result.phoneNumber}  whatsapp Account`;
      }catch(err:any){
        throw new Error(`Failed to login : ${err.message}`);
      }
      }
    }