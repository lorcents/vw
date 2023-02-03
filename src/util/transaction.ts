import { Prisma, PrismaClient } from "@prisma/client";
import to from "await-to-js";
import * as type from "../interface";

const prisma = new PrismaClient();
export const getPendingTransaction = async (
  id: number
): Promise<type.pendingTransaction | string> => {
  let error, pendingTransaction;
  [error, pendingTransaction] = await to(
    prisma.pendingTransaction.findUnique({
      where: {
        id: id,
      },
    })
  );

  if (
    error ||
    pendingTransaction === null ||
    pendingTransaction === undefined
  ) {
    return `Error finding transaction with id : ${id}`;
  }
  return pendingTransaction;
};
/**
 * @param  {type.pendingTransaction} pendingTransaction
 * @param  {number} updatedBalance
 */
export const createTransaction = async (
  pendingTransaction: type.pendingTransaction,
  updatedBalance: number
): Promise<type.Transaction | string> => {
  let err, transaction;
  [err, transaction] = await to(
    prisma.transaction.create({
      data: {
        transactionId: pendingTransaction.id,
        transactionType: pendingTransaction.transactionType,
        wallet: { connect: { id: pendingTransaction.walletId } },
        amount: pendingTransaction.amount,
        cost: pendingTransaction.fee,
        comment: pendingTransaction.comment,
        accNumber: pendingTransaction.accNumber,
        balance: updatedBalance,
        con: pendingTransaction.con,
      },
    })
  );

  if (err || transaction === undefined) {
    return "could not process transaction";
  }

  return transaction;
};

export const updateWalletBal = async (
  walletId: number,
  updatedBalance: number
): Promise<type.wallet | string> => {
  let err, walletBalanceUpdate;
  [err, walletBalanceUpdate] = await to(
    prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: updatedBalance,
      },
    })
  );

  if (err || walletBalanceUpdate === undefined) {
    return `Failed to update balance :${err?.message}`;
  }

  return walletBalanceUpdate;
};
