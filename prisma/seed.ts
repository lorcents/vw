import { join } from "path";
import { homedir } from "os";
import { readFileSync, existsSync } from "fs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const countriesFile = join(__dirname, "seed", `countries.json`);
const bankFile = join(__dirname, "seed", "banks.json");

const countries = JSON.parse(readFileSync(countriesFile, "utf-8"));
const banks = JSON.parse(readFileSync(bankFile, "utf-8"));

async function runAll() {
  try {
    await loadBanks();
    await initialize();
  } catch (e) {
    console.log(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
runAll();

async function initialize() {
  for (const { id, currencyCode, label, currencyName, dialCode } of countries) {
    const currency = await prisma.currency.create({
      data: {
        currencyCode: currencyCode,
        countryCode: id.toUpperCase(),
        currencyName: currencyName,
        countryName: label,
        countryDialCode: dialCode,
      },
    });

    console.log({ currency });
  }

  const currency = await prisma.currency.findUnique({
    where: {
      countryCode: "KE",
    },
  });

  if (!currency) {
    throw new Error(`Currency with country code KE not found`);
  }

 await prisma.user.createMany({
  data:[
    {
      firstName:"System",
      secondName:"Wallet",
      phoneNumber:"+254712345678",
      status:true
    },
    {
      firstName:"Jenga",
      secondName:"Copy",
      phoneNumber:"+254700000000",
      status:true
    }
  ]
})

const users = await prisma.user.findMany({})
const userIds = users.map(user=>user.id)

for (const userId of userIds){
  await prisma.wallet.create({
    data: 
      {
        balance: 0,
        currencyId: currency.id,
        userId
      }

  });
}
}

  
async function loadBanks() {
  for (const { bankName, bankCode, countryCode } of banks) {
    const kenyaBank = await prisma.kenyaBanks.create({
      data: {
        bankName: bankName,
        bankCode: bankCode,
        countryCode: countryCode,
      },
    });

    console.log({ kenyaBank });
  }
}

// async function initialWallet() {
//   const currency = await prisma.currency.findUnique({
//     where: {
//       countryCode: "KE",
//     },
//   });

//   if (!currency) {
//     throw new Error(`Currency with country code KE not found`);
//   }

//   await prisma.wallet.createMany({
//     data: [
//       {
//         userId: "System Wallet",
//         balance: 0,
//         currencyId: currency.id,
//       },
//       {
//         userId: "Jenga Copy",
//         balance: 0,
//         currencyId: currency.id,
//       },
//     ],
//   });
// }
