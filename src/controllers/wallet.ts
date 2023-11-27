import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";

import * as type from "../interface";
import { WalletServices } from "../services/wallet.Service";
import { TransactionService } from "../services/transaction.Service";

const prisma = new PrismaClient();

export const wallet = {
  createWallet: async (req: express.Request, res: express.Response, next :express.NextFunction) => {
    const data: type.wallet = req.body;
    try {
      const wallet = await WalletServices.createWallet(data);
      res.status(200).json(wallet);
    }
    catch(error){
      next(error)
    }
   

  
  },

  createPin: async (req: express.Request, res: express.Response, next :express.NextFunction) => {
    const data: { userId: string; pin: string } = req.body;
    try {
      const result = await WalletServices.createPin(data.userId, data.pin);
      res.json(result);
    }catch(error){
      next(error)
    }
    
  },

  checkPin: async (req: express.Request, res: express.Response, next : express.NextFunction) => {
    const data: { userId: string } = req.body;
    try{
      const result = await WalletServices.checkPin(data.userId);

      res.json(result);
    }catch(error){
      next(error)
    }
    
  },

  getWallet: async (req: express.Request, res: express.Response,next:express.NextFunction) => {
    const userId: string = req.body.userId;
    try{
      const wallet = await WalletServices.fetchWallet(userId);

      res.json(wallet);
    }catch(error){
      next(error)
    }
    
  },

  createExternalWallet: async (req: express.Request, res: express.Response, next :express.NextFunction) => {
    const data: type.TransactionBody = req.body;
   try{
    const externalWallet = await WalletServices.createExternalWallet(data);
    res.json(externalWallet);
   }catch(error){
    next(error)
   }
   

    
  },
};

export const currency = {
  getCurrency: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { countryCode } = req.body as { countryCode: string };

    try {
      const currency = await WalletServices.fetchCurrency(countryCode);

      res.json(currency);
    }catch(error){
      next(error)
    }

   
  },
  getSupportedcurrencies: async (
    req: express.Request,
    res: express.Response,
    next:express.NextFunction
  ) => {
    try{
      const supportedCurrencies = await WalletServices.getSupportedCurrencies();
      res.json(supportedCurrencies)
    }catch(error){
      next(error)
    }
    
  },
};

export const transaction = {
  fetchRecentTransactions: async (
    req: express.Request,
    res: express.Response,
    next:express.NextFunction
  ) => {
    const { n, walletId } = req.body as { n: number; walletId: number };

    try{
      const results = await TransactionService.fetchRecentTransactions(
        n,
        walletId
      );
  
      res.json(results);
    }catch(error){
      next(error)
    }
    
  },
  fetchBanks: async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try{
      const kenyaBanks = await WalletServices.fetchBanks();
      res.json(kenyaBanks);
    }catch(error){
      next(error)
    }
  
  },
};
