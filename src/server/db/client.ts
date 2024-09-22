import { PrismaClient } from "@prisma/client";
import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: isDevelopmentOrPreview() ? env.DATABASE_URL_DEV : env.DATABASE_URL_PROD,
      }
    }
  });

function isDevelopmentOrPreview() {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview'
  );
}

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
