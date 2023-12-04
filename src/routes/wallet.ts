import express from "express";

import { wallet, transaction } from "../controllers/wallet";

const walletRouter = express.Router();

walletRouter.post("/create-wallet", wallet.createWallet);
walletRouter.post("/createPin", wallet.createPin);
walletRouter.get("/checkPin/:phoneNumber", wallet.checkPin);

walletRouter.get("/fetchWallet/:phoneNumber", wallet.getWallet);


walletRouter.get(
  "/fetchRecenttransactions",
  transaction.fetchRecentTransactions
);
walletRouter.get("/fetchBanks", transaction.fetchBanks);

export default walletRouter;
