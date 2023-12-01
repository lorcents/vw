import { Prisma, PrismaClient } from "@prisma/client";
import * as type from "../interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export abstract class WalletServices {
  protected static incorrectAttempts = 0;
  /**
   * @param  {type.wallet} data
   */
  static async createWallet(data: type.wallet): Promise<any> {
    if(!data) throw new Error("Please provide valid data");
    try {

      const existingWallet = await prisma.wallet.findUnique({
        where: { userId: data.userId },
      });
  
      if (existingWallet) {
        throw new Error(`Wallet already exists for userID: ${data.userId}`);
      }
      const result = await prisma.wallet.create({
        data: {
          userId: data.userId,
          currency: { connect: { countryCode: data.countryCode } },
          balance: 0,
        },
      });
      return result;
    } catch (err: any) {
      throw new Error( `Failed to create wallet : ${err.message}`);
    }
  }
  /**
   * @param  {number} id
   */
  static async fetchWallet(userId: string,): Promise<any> {
    try {
      const result = await prisma.wallet.findUnique({
        where: { userId: userId  } ,
        select: {
          id: true,
          userId: true,
          balance: true,
          currency: {
            select: {
              countryName: true,
              currencyCode: true,
              countryCode: true,
            },
          },
        },
      });
      return result;
    } catch (err: any) {
      throw new Error (err.message);
    }
  }
  /**
   * @param  {type.externalWallet} data
   */
  static async createExternalWallet(data: type.TransactionBody): Promise<any> {
    try {
      const currency = await prisma.currency.findUnique({
        where: { countryCode: data.serviceBody.countryCode },
      });

      if (!currency) {
        throw new Error(
          `Currency with country code ${data.serviceBody.countryCode} not found`
        );
      }
      const result = await prisma.externalWallet.create({
        data: {
          name: data.serviceBody.name,
          bankName: data.serviceBody.bankName,
          bankCode: data.serviceBody.bankCode,
          accountNumber: data.serviceBody.accNo,
          serviceId: data.serviceId,
          currency: { connect: { id: currency.id } },
          Wallet: { connect: { id: data.walletId } },
        },
      });

      return result;
    } catch (err: any) {
      throw new Error (err.message);
    }
  }

  /**
   * @param  {type.currency} data
   */

  static async fetchCurrency(countryCode: string): Promise<any> {
    try {
      const result = await prisma.currency.findUnique({
        where: {
          countryCode: countryCode,
        },
      });

      return result;
    } catch (err) {
      throw new Error (`No currency found with country code ${countryCode}`);
    }
  }
  static async createPin(userId: string, pin: string): Promise<any> {
    const hash = await bcrypt.hash(pin, 10);
    try {
      const result = await prisma.wallet.update({
        where: {
          userId: userId,
        },
        data: {
          pin: hash,
        },
      });
      return result;
    } catch (err: any) {
      throw new Error (err.message);
    }
  }
  static async checkPin(userId: string): Promise<any> {
    try {
      const result = await prisma.wallet.findUnique({
        where: { userId },
        select: {
          pin: true,
        },
      });
      if (result?.pin) {
        return { satus : 1,
        message :`There is a pin associated with the wallet`}; //
      } else {
        return { satus : 0,
          message :`There is No  pin associated with the wallet`};
      }
    } catch (err: any) {
      throw new Error( err.message);
    }
  }

  // define a counter to keep track of the incorrect attempts
  // let incorrectAttempts = 0;

  static async comparePin(walletId: number, pin: string) {
    const hashedPin = await prisma.wallet.findUnique({
      where: { id: walletId },
      select: {
        pin: true,
      },
    });

    if (!hashedPin?.pin) {
      throw new Error ("Your wallet pin could not be found.")
    }

    const isPinCorrect = await bcrypt.compare(pin, hashedPin.pin);

    if (!isPinCorrect) {
      // increment the counter if pin is incorrect
      this.incorrectAttempts += 1;

      // check if the number of incorrect attempts is equal to 3
      if (this.incorrectAttempts === 3) {
        // return error message indicating that the account is blocked
        throw new Error (
            "Your account has been blocked due to multiple incorrect attempts. Please contact  support .",
        );
      }

      // return error message indicating that the pin is incorrect
      throw new Error ("Incorrect pin. Please try again." );
    }

    // reset the incorrectAttempts counter if pin is correct
    this.incorrectAttempts = 0;

    // return a JSON web token if pin is correct
    // const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { isPinCorrect };
  }
  static async fetchBanks() {
    const kenyaBanks = await prisma.kenyaBanks.findMany();
    return kenyaBanks;
  }

  static async getSupportedCurrencies() {
    const supportedCountries = ["KE", "US", "ET", "RW"];
    const supportedCurrencies = await prisma.currency.findMany({
      where: {
        countryCode: {
          in: supportedCountries,
        },
      },
    });
    return supportedCurrencies;
  }
}
