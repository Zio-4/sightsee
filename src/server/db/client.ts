import { PrismaClient } from "@prisma/client";

import { env } from "../../env/server.mjs";

// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }


// function getDatabaseURL() {
//   let url

//   console.log('prod url: ', process.env.DATABASE_URL_PROD)

//   if (env.NODE_ENV === 'production') url = process.env.DATABASE_URL_PROD
//   else url = process.env.DATABASE_URL_DEV

//   return url + '?slaccept=strict&connect_timeout=300'
// }

export const prisma =
  // global.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: `${env.NODE_ENV === 'production' ? env.DATABASE_URL_PROD : env.DATABASE_URL_DEV}?slaccept=strict&connect_timeout=300`,
      }
    }
  });

// if (env.NODE_ENV !== "production") {
//   global.prisma = prisma;
// }
