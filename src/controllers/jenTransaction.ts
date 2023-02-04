import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";

import { parse, stringify, toJSON, fromJSON } from "flatted";

import { Mutex, MutexInterface } from "async-mutex";

import * as type from "../interface";

// import { synchronusFunction } from "./Transaction";
import { TransactionService } from "../services/transaction.Service";
import { JengaServices } from "../services/jenTrans.Service";
import { LogServices } from "../services/log.Service";

const mutex = new Mutex();
const prisma = new PrismaClient();
/**
 * @param  {express.Request} req
 * @param  {express.Response} res
 */
export const jengaTransaction = {
  initiateTransation: async (req: express.Request, res: express.Response) => {
    //
    const data: type.TransactionBody = req.body;

    const pendingTransaction = await JengaServices.initiatedTransaction(data);

    // Create initial log

    const log1 = await LogServices.createLog({
      transactionId: pendingTransaction.id,
      logObj: stringify(pendingTransaction),
      status: "pending",
    });

    //Balance should be greater than amount to be transacted

    /*
     send request to jenga end point
     */

    const jenRequest = await JengaServices.jengaRequest(
      data,
      pendingTransaction
    );

    let status: string;

    if (jenRequest.status === "SUCCESS") {
      status = "success";
    } else {
      status = "failed";
    }

    //Log Response from jenga end point
    const log2 = await LogServices.createLog({
      transactionId: pendingTransaction.id,
      logObj: stringify(jenRequest),
      status: status,
    });
    // update status

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
    let jenReq = jenRequest;
    let transaction = x;
    res.json({ tranRes, jenReq, transaction, x });
  },
};
