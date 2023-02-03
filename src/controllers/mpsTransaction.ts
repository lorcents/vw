import express from "express";

import { parse, stringify, toJSON, fromJSON } from "flatted";

import { Mutex, MutexInterface } from "async-mutex";

import * as type from "../interface";
// import { synchronusFunction } from "./Transaction";
import { TransactionService } from "../services/transaction.Service";

import { MpsService } from "../services/mpsTrans.Service";
import { LogServices } from "../services/log.Service";

const mutex = new Mutex();

export const mpsTransaction = {
  initiateTransaction: async (req: express.Request, res: express.Response) => {
    const data: type.TransactionBody = req.body;
    console.log(data);

    //initiate transaction
    const pendingTransaction = await MpsService.initiateTransaction(data);
    const jsonObject = stringify(pendingTransaction);

    const stkData = {
      phoneNumber: pendingTransaction.phoneNumber,
      amount: pendingTransaction.amount + pendingTransaction.fee,
    };

    //create a log 1
    const log1Data = {
      transactionId: pendingTransaction.id,
      logObj: jsonObject,
      status: "pending",
    };
    const log1 = await LogServices.createLog(log1Data);

    //Stk Request

    const stkRequest = await MpsService.stkRequest(stkData);
    console.log(stkRequest);

    let status: string;

    if (stkRequest.response.ResponseCode === "0") {
      status = "success";
    } else {
      status = "failed";
    }

    const log2Data = {
      transactionId: pendingTransaction.id,
      logObj: stringify(stkRequest),
      status: status,
    };

    //create a log 2
    const log2 = await LogServices.createLog(log2Data);

    //update status
    const statusUpdate = await LogServices.updateStatus({
      id: pendingTransaction.id,
      status: status,
    });

    //simulation code
    let x;
    if (statusUpdate.status === "success") {
      x = await TransactionService.transaction(mutex, pendingTransaction.id);
    }
    if (statusUpdate.status === "failed") {
      const deleteTransaction = await LogServices.deleteTransaction(
        statusUpdate.id
      );
    }

    let tranRes = pendingTransaction;
    let stkRes = stkRequest.response;
    let transaction = x;
    res.json({ tranRes, stkRes, transaction });
  },
};
