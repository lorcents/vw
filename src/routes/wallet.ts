import express from "express";

import { wallet, transaction } from "../controllers/wallet";
import { authenticateToken } from "../middleware";

const walletRouter = express.Router();

walletRouter.post("/create-wallet", authenticateToken, wallet.createWallet);
walletRouter.post("/createPin", authenticateToken, wallet.createPin);
walletRouter.get("/checkPin/:phoneNumber", authenticateToken, wallet.checkPin);

walletRouter.get("/fetchWallet/:phoneNumber",authenticateToken,  wallet.getWallet);


walletRouter.get(
  "/fetchRecenttransactions",authenticateToken,
  transaction.fetchRecentTransactions
);
walletRouter.get("/fetchBanks", transaction.fetchBanks);

export default walletRouter;
