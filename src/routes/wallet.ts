import express from "express";

import { wallet, transaction } from "../controllers/wallet";

const walletRouter = express.Router();

walletRouter.post("/wallet", wallet.createWallet);
walletRouter.post("/user", wallet.createUser)
walletRouter.post("/createPin", wallet.createPin);
walletRouter.get("/checkPin", wallet.checkPin);

walletRouter.get("/fetchWallet", wallet.getWallet);


walletRouter.get(
  "/fetchRecenttransactions",
  transaction.fetchRecentTransactions
);
walletRouter.get("/fetchBanks", transaction.fetchBanks);

export default walletRouter;
