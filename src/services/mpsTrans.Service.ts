import { Prisma, PrismaClient } from "@prisma/client";
import axios from "axios";
import to from "await-to-js";

import * as type from "../interface";
import { mps_url } from "../../config";

const prisma = new PrismaClient();

export abstract class MpsService {
  static async initiateTransaction(data: type.TransactionBody): Promise<any> {
    let err, pendingTransaction;

    [err, pendingTransaction] = await to(
      prisma.pendingTransaction.create({
        data: {
          transactionType: "credit",
          amount: data.serviceBody.amount,
          fee: data.serviceBody.fee,
          comment: data.comment,
          service:data.service,
          accNumber: data.serviceBody.phoneNo,
          appId: "12345",
          status: "pending",

          wallet: { connect: { id: data.walletId } },
        },
      })
    );

    if (err || pendingTransaction === undefined) {
      return "Could not process transaction,try again ";
    }

    return pendingTransaction;
  }

  static async stkRequest(data: type.stkReqbody): Promise<any> {
    let err, stkRequest;
    [err, stkRequest] = await to(
      axios.post(mps_url, {
        phoneNumber: data.phoneNumber,
        amount: data.amount,
      })
    );

    if (err || stkRequest === undefined) {
      console.log(err?.message);
      return "Failed to send stk request";
    }

    return stkRequest.data;
  }
}
