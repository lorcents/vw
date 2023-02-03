import { Prisma, PrismaClient } from "@prisma/client";

import axios from "axios";
import to from "await-to-js";

import * as type from "../interface";

import { jen_url } from "../../config";
import { pesaLinkCharges } from "../util/fee";
import { checkBalance } from "../util/Balance";

const prisma = new PrismaClient();

export abstract class JengaServices {
  /**
   * @param  {type.jenTransactionBody} data
   */
  static async initiatedTransaction(
    data: type.jenTransactionBody
  ): Promise<any> {
    let err, pendingTransaction;

    const fee = pesaLinkCharges(data.amount);

    // creates the initiated transaction
    [err, pendingTransaction] = await to(
      prisma.pendingTransaction.create({
        data: {
          transactionType: "debit",
          amount: data.amount,
          fee: fee,
          comment: data.comment,
          appId: data.appId,
          accNumber: data.accountNumber,
          status: "pending",

          wallet: { connect: { id: data.walletId } },
        },
      })
    );

    if (err || pendingTransaction === undefined) {
      return "Could not process transaction";
    }

    return pendingTransaction;
  }

  static async jengaRequest(
    data: type.pendingTransaction,
    phoneNumber: string
  ): Promise<any> {
    let err, jenRequest;
    const balance = await checkBalance(data.walletId);

    if (data.amount > balance) {
      return "Insuffucient Balance";
    }
    /*
     send request to jenga end point
     */
    [err, jenRequest] = await to(
      axios.post(jen_url, {
        phoneNumber: phoneNumber,
        amount: data.amount - data.fee,
        accountNumber: data.accNumber,
        description: data.comment,
      })
    );
    if (err || jenRequest === undefined) {
      return "Failed to send jengaRequest";
    }

    return jenRequest.data;
  }
}
