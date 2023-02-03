import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import * as type from "../interface";

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

  if (balance == undefined || balance == null) {
    throw Error();
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
  const feeBalance = await checkBalance(1);

  //Balances
  let currBal: number;
  if (pendingTransaction.transactionType === "credit") {
    currBal = balance + pendingTransaction.amount;
  } else if (pendingTransaction.transactionType === "debit") {
    currBal = balance - pendingTransaction.amount;
  }

  // const updatedBalance = balance - amount;
  const updatedFeeBalance = feeBalance + pendingTransaction.fee;
  const updatedBalance = currBal!;

  return { updatedBalance, updatedFeeBalance };
};
