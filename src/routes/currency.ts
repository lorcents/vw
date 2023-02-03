import express from "express";

import { currency } from "../controllers/wallet";

const currencyRouter = express.Router();

currencyRouter.post("/currency", currency.createCurrency);

currencyRouter.get("/currency/:id", currency.getCurrency);

export default currencyRouter;
