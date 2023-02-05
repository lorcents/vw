import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";

import * as type from "../interface";
import { WalletServices } from "../services/wallet.Service";
import { TransactionService } from "../services/transaction.Service";

const prisma = new PrismaClient();

export const wallet = {
  createWallet: async (req: express.Request, res: express.Response) => {
    const data: type.wallet = req.body;

    const wallet = await WalletServices.createWallet(data);

    res.status(200).json(wallet);
  },

  createPin: async (req: express.Request, res: express.Response) => {
    const data: { UserId: string; pin: string } = req.body;
    const result = await WalletServices.createPin(data.UserId, data.pin);
    res.json(result);
  },

  checkPin: async (req: express.Request, res: express.Response) => {
    const data: { userId: string } = req.body;
    const result = await WalletServices.checkPin(data.userId);

    res.json(result);
  },

  getWallet: async (req: express.Request, res: express.Response) => {
    const userId: string = req.body.userId;

    const wallet = await WalletServices.fetchWallet(userId);

    res.json(wallet);
  },

  createExternalWallet: async (req: express.Request, res: express.Response) => {
    const data: type.TransactionBody = req.body;

    const externalWallet = await WalletServices.createExternalWallet(data);

    res.json(externalWallet);
  },
};

export const currency = {
  getCurrency: async (req: express.Request, res: express.Response) => {
    const { countryCode } = req.body as { countryCode: string };

    const currency = await WalletServices.fetchCurrency(countryCode);

    res.json(currency);
  },
};

export const transaction = {
  fetchRecentTransactions: async (
    req: express.Request,
    res: express.Response
  ) => {
    const { n, walletId } = req.body as { n: number; walletId: number };

    const results = await TransactionService.fetchRecentTransactions(
      n,
      walletId
    );

    res.json(results);
  },
};
