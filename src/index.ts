import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import walletRouter from "./routes/wallet";
import currencyRouter from "./routes/currency";
import transactionRouter from "./routes/transaction";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (res, req) => {});
app.use("/", currencyRouter);
app.use("/", walletRouter);
app.use("/", transactionRouter);

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});
