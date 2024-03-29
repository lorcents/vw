import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import * as type from "../interface";
import { SYSTEMWALLETID } from "./const";

const prisma = new PrismaClient();

export const checkBalance = async (walletId: number): Promise<number> => {
  let balance = await prisma.wallet.findUnique({
    where: {
      id: walletId,
    },
    select: {
      balance: true,
    },
  });

  console.log(balance);

  if (balance?.balance == undefined || balance.balance == null) {
    throw Error("Balance is undefined or null");
  }

  let walletBalance = balance!.balance;

  return walletBalance;
};

interface updatedBal {
  updatedBalance: number;
  updatedFeeBalance: number;
}

export const updateBalance = async (
  pendingTransaction: type.pendingTransaction
): Promise<updatedBal> => {
  const balance = await checkBalance(pendingTransaction.walletId);
  const feeBalance = await checkBalance(SYSTEMWALLETID);

  //Balances
  let currBal: number;
  if (pendingTransaction.transactionType === "credit") {
    currBal = balance + pendingTransaction.amount;
  } else if (pendingTransaction.transactionType === "debit") {
    currBal = balance - (pendingTransaction.amount + pendingTransaction.fee);
  }

  // const updatedBalance = balance - amount;
  const updatedFeeBalance = feeBalance + pendingTransaction.fee;
  const updatedBalance = currBal!;

  return { updatedBalance, updatedFeeBalance };
};
