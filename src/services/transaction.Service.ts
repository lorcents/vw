import { PrismaClient } from "@prisma/client";
import { Mutex, MutexInterface } from "async-mutex";

import { updateBalance } from "../util/Balance";
import { LogServices } from "./log.Service";
import {
  getPendingTransaction,
  createTransaction,
  updateWalletBal,
} from "../util/transaction";
import { SYSTEMWALLETID } from "../util/const";

const prisma = new PrismaClient();

const mutex = new Mutex();
// IMPORTANT: Failure to call release will hold the mutex locked and will likely deadlock the application.
//Make sure to call release under all circumstances and handle exceptions accordingly
export abstract class TransactionService {
  //synchronusFunction
  static async transaction(
    mutex: MutexInterface,
    transId: number
  ): Promise<any> {
    //
    const release = await mutex.acquire();

    const pendingTransaction = await getPendingTransaction(transId);
    if (typeof pendingTransaction === "string") {
      release();
      return pendingTransaction;
    }

    if (pendingTransaction.status !== "success") {
      release();
      return `Transaction status is still ${pendingTransaction.status}`;
    }

    //Updated wallet and fee Balance
    const { updatedBalance, updatedFeeBalance } = await updateBalance(
      pendingTransaction
    );

    //Create the transaction
    const transaction = await createTransaction(
      pendingTransaction,
      updatedBalance
    );
    if (typeof transaction === "string") {
      release();
      return transaction;
    }

    //update balances
    const walletBalanceupdate = await updateWalletBal(
      pendingTransaction.walletId,
      updatedBalance
    );
    const updateFeebalWallet = await updateWalletBal(
      SYSTEMWALLETID,
      updatedFeeBalance
    );
    if (
      typeof walletBalanceupdate === "string" ||
      typeof updateFeebalWallet === "string"
    ) {
      release();
      return "Error  updating balances";
    }

    //const Delete Transaction

    const deletedTansaction = await LogServices.deleteTransaction(
      pendingTransaction.id
    );

    //finally release

    console.log(
      `${transaction.transactionId} -->${transaction.amount}: ${transaction.balance}`
    );

    release();

    return `Transaction succesul : ${transaction}`;
  }

  //Fetch Recent transactin
  static async fetchRecentTransactions(
    n: number,
    walletId: number
  ): Promise<any> {
    try {
      const result = await prisma.transaction.findMany({
        where: { walletId: walletId },
        orderBy: { transactionId: "desc" },
        take: n,
      });

      return result;
    } catch (err: any) {
      return err.message;
    }
  }
}
