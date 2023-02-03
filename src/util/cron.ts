import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";

const prisma = new PrismaClient();
let isRunning = true;

const job = new CronJob("* * * * * *", async function () {
  console.log("Check every second:", ", isRunning: ", isRunning);

  const result = await prisma.pendingTransaction.findFirst({
    where: {
      status: "success",
    },
  });
});

job.start();
