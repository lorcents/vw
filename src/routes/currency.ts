import express from "express";

import { currency } from "../controllers/wallet";

const currencyRouter = express.Router();

currencyRouter.post("/fetchCurrency", currency.getCurrency);
currencyRouter.get("/fechSupportedCurrencies", currency.getSupportedcurrencies);

export default currencyRouter;
