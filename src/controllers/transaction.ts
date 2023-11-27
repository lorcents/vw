import { Request, Response ,NextFunction} from "express";
import { TransactionBody } from "../interface";

export const transaction = async (req: Request, res: Response,next:NextFunction) => {
  const body: TransactionBody = req.body;

  console.log(body);

  res.json();
};

// const body2 = {
//   walletId: 1, //wallet ID
//   comment: "",
//   transactionType: "", //transaction type: debit or credit
//   service: "",
//   serviceId: "",
//   serviceBody: {},
// };
