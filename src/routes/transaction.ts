import express from "express";
import { mpsTransaction } from "../controllers/mpsTransaction";
import { jengaTransaction } from "../controllers/jenTransaction";
import { transaction } from "../controllers/transaction";
import { authenticateToken } from "../middleware";

const transactionRouter = express.Router();

transactionRouter.post("/mpsTransaction",authenticateToken, mpsTransaction.initiateTransaction);

transactionRouter.post("/jenTransaction", authenticateToken,jengaTransaction.initiateTransation);

transactionRouter.post("/initiateTransaction", transaction);

export default transactionRouter;
