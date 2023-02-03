import express from "express";
import { mpsTransaction } from "../controllers/mpsTransaction";
import { jengaTransaction } from "../controllers/jenTransaction";
import { transaction } from "../controllers/transaction";

const transactionRouter = express.Router();

transactionRouter.post("/mpsTransaction", mpsTransaction.initiateTransaction);

transactionRouter.post("/jenTransaction", jengaTransaction.initiateTransation);

transactionRouter.post("/initiateTransaction", transaction);

export default transactionRouter;
