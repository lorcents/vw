import express from "express";

import { wallet, transaction } from "../controllers/wallet";

const walletRouter = express.Router();

walletRouter.post("/wallet", wallet.createWallet);
walletRouter.post("/createPin", wallet.createPin);
walletRouter.post("/checkPin", wallet.checkPin);

walletRouter.post("/fetchWallet", wallet.getWallet);

walletRouter.post(
  "/fetchRecenttransactions",
  transaction.fetchRecentTransactions
);

export default walletRouter;
