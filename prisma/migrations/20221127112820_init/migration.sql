-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "UserId" TEXT NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "externalWallet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankCode" INTEGER NOT NULL,
    "countryCode" TEXT NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,

    CONSTRAINT "externalWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" SERIAL NOT NULL,
    "currencyName" VARCHAR(255) NOT NULL,
    "currencySymbol" VARCHAR(10) NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "usdEquivalent" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pendingTransaction" (
    "id" SERIAL NOT NULL,
    "transactionType" VARCHAR(10) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "fee" DECIMAL(65,30) NOT NULL,
    "comment" VARCHAR(255) NOT NULL,
    "appId" TEXT NOT NULL,
    "con" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL,
    "walletId" INTEGER NOT NULL,

    CONSTRAINT "pendingTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "transactionObj" JSONB NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "comment" VARCHAR(255) NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "con" TIMESTAMP(3) NOT NULL,
    "valueTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "fee" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "fee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "externalWallet_walletId_key" ON "externalWallet"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionId_key" ON "Transaction"("transactionId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "externalWallet" ADD CONSTRAINT "externalWallet_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendingTransaction" ADD CONSTRAINT "pendingTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
