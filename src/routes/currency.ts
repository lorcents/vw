import express from "express";

import { currency } from "../controllers/wallet";

const currencyRouter = express.Router();

currencyRouter.post("/fetchCurrency", currency.getCurrency);

export default currencyRouter;
