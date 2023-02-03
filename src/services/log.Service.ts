import { Prisma, PrismaClient } from "@prisma/client";
import to from "await-to-js";
import * as type from "../interface";

const prisma = new PrismaClient();
export abstract class LogServices {
  /**
   * @param  {type.log} data
   */
  static async createLog(data: type.log): Promise<any> {
    let err, log;
    [err, log] = await to(
      prisma.logs.create({
        data: {
          transactionId: data.transactionId,
          transactionObj: data.logObj,
          status: data.status,
        },
      })
    );
    if (err || log === undefined) {
      return "could not create the Log";
    }

    return log;
  }
  /**
   * @param  {type.statusUpdate} data
   */
  static async updateStatus(data: type.statusUpdate): Promise<any> {
    let err, statusUpdate;
    [err, statusUpdate] = await to(
      prisma.pendingTransaction.update({
        where: {
          id: data.id,
        },
        data: {
          status: data.status,
        },
      })
    );

    if (err || statusUpdate === undefined) {
      return "Failed to update status";
    }
    console.log(statusUpdate);

    return statusUpdate;
  }

  static async deleteTransaction(id: number): Promise<any> {
    let err, deleteTransaction;
    [err, deleteTransaction] = await to(
      prisma.pendingTransaction.delete({
        where: {
          id: id,
        },
      })
    );

    if (err || deleteTransaction === undefined) {
      return `Failed to delete transaction with id : ${id}`;
    }

    return deleteTransaction;
  }
}
