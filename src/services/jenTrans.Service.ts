import { Prisma, PrismaClient } from "@prisma/client";

import axios from "axios";
import to from "await-to-js";

import * as type from "../interface";

import { jen_url } from "../../config";
import { pesaLinkCharges } from "../util/fee";
import { checkBalance } from "../util/Balance";
import { WalletServices } from "./wallet.Service";

const prisma = new PrismaClient();

export abstract class JengaServices {
  /**
   * @param  {type.jenTransactionBody} data
   */
  static async initiatedTransaction(data: type.TransactionBody): Promise<any> {
    let err, pendingTransaction;

    const fee = pesaLinkCharges(data.serviceBody.amount);

    // creates the initiated transaction
    [err, pendingTransaction] = await to(
      prisma.pendingTransaction.create({
        data: {
          transactionType: data.transactionType,
          amount: data.serviceBody.amount,
          fee: fee,
          comment: data.comment,
          appId: "MALIPO",
          service: data.service,
          accNumber: data.serviceBody.accNo,
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
    data: type.TransactionBody,
    pendingTransaction: type.pendingTransaction
  ): Promise<any> {
    let err, jenRequest;

    const validatedPin = await WalletServices.comparePin(
      data.walletId,
      data.serviceBody.pin
    );

    if (!validatedPin.isPinCorrect) {
      return validatedPin;
    }
    const balance = await checkBalance(data.walletId);

    if (pendingTransaction.amount + pendingTransaction.fee > balance) {
      return "Insuffucient Balance";
    }
    /*
     send request to jenga end point
     */
    [err, jenRequest] = await to(axios.post(jen_url, data));
    if (err || jenRequest === undefined) {
      return "Failed to send jengaRequest";
    }

    return jenRequest.data;
  }
}
