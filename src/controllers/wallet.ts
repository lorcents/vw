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
    const result = await WalletServices.createPassword(
      data.UserId,
      data.pin
    );
    res.json(result);
  },

  checkPin: async (req: express.Request, res: express.Response) => {
    const data:{UserId: string}=req.body;
    const result =await WalletServices.checkPassword(data.UserId)

    res.json(result)
  },

  getWallet: async (req: express.Request, res: express.Response) => {
    const UserId: string = req.body.UserId;

    const wallet = await WalletServices.fetchWallet(UserId);

    res.json(wallet);
  },

  createExternalWallet: async (req: express.Request, res: express.Response) => {
    const data: type.externalWallet = req.body;

    const externalWallet = await WalletServices.createExternalWallet(data);

    res.json(externalWallet);
  },
};

export const currency = {
  createCurrency: async (req: express.Request, res: express.Response) => {
    const data: type.currency = req.body;

    const currency = await WalletServices.createCurrency(data);

    res.json(currency);
  },
  getCurrency: async (req: express.Request, res: express.Response) => {
    const id: number = +req.params.id;

    const currency = await WalletServices.fetchCurrency(id);

    res.json(currency);
  },
};

export const transaction = {
  fetchRecentTransactions: async (
    req: express.Request,
    res: express.Response
  ) => {
    const { n, walletId } = req.body;

    const results = await TransactionService.fetchRecentTransactions(
      n,
      walletId
    );

    res.json(results);
  },
};
