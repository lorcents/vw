import { Prisma, PrismaClient } from "@prisma/client";
import * as type from "../interface";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export abstract class WalletServices {
  /**
   * @param  {type.wallet} data
   */
  static async createWallet(data: type.wallet): Promise<any> {
    try {
      const result = await prisma.wallet.create({
        data: {
          UserId: data.UserId,
          currency: { connect: { countryCode: data.countryCode } },
          balance: 0,
        },
      });
      return result;
    } catch (err: any) {
      return err.message;
    }
  }
  /**
   * @param  {number} id
   */
  static async fetchWallet(UserId: string): Promise<any> {
    try {
      const result = await prisma.wallet.findUnique({
        where: { UserId },
        select: {
          id: true,
          UserId: true,
          balance: true,
          countryCode: true,
        },
      });
      return result;
    } catch (err: any) {
      return err.message;
    }
  }
  /**
   * @param  {type.externalWallet} data
   */
  static async createExternalWallet(data: type.externalWallet): Promise<any> {
    try {
      const result = await prisma.externalWallet.create({
        data: {
          name: data.fullName,
          bankName: data.bankName,
          bankCode: data.bankcode,
          accountNumber: data.accountNumber,
          countryCode: data.countryCode,
          Wallet: { connect: { id: data.walletId } },
        },
      });

      return result;
    } catch (err: any) {
      return err.message;
    }
  }

  /**
   * @param  {type.currency} data
   */
  static async createCurrency(data: type.currency): Promise<any> {
    try {
      const result = await prisma.currency.create({
        data: {
          currencyName: data.currencyName,
          currencySymbol: data.currencySymbol,
          usdEquivalent: data.usdEquivalent,
          currencyCode: data.currencyCode,
          countryCode: data.countryCode,
        },
      });
      return result;
    } catch (err) {
      console.log(err);
      return "Error creating currency";
    }
  }

  static async fetchCurrency(id: number): Promise<any> {
    try {
      const result = await prisma.currency.findUnique({
        where: {
          id: id,
        },
      });

      return result;
    } catch (err) {
      return `No currency found with id ${id}`;
    }
  }
  static async createPassword(UserId: string, password: string): Promise<any> {
    const hash = await bcrypt.hash(password, 10);
    try {
      const result = await prisma.wallet.update({
        where: {
          UserId,
        },
        data: {
          password: hash,
        },
      });
      return result;
    } catch (err) {
      return "Error creating password";
    }
  }
  static async checkPassword(UserId: string): Promise<any> {
    try {
      const result = await prisma.wallet.findUnique({
        where: { UserId },
        select: {
          password: true,
        },
      });
      if (result?.password) {
        return 1;
      } else {
        return 0;
      }
    } catch (err: any) {
      return err.message;
    }
  }
}
