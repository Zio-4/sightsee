// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  // DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  // NEXTAUTH_URL: z.preprocess(
  //   // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
  //   // Since NextAuth.js automatically uses the VERCEL_URL if present.
  //   (str) => process.env.VERCEL_URL ?? str,
  //   // VERCEL_URL doesn't include `https` so it cant be validated as a URL
  //   process.env.VERCEL ? z.string() : z.string().url(),
  // ),
  // DISCORD_CLIENT_ID: z.string(),
  // DISCORD_CLIENT_SECRET: z.string(),
  DATABASE_URL_PROD: z.string(),
  DATABASE_URL_DEV: z.string(),
  UNSPLASH_ACCESS_KEY: z.string(),
  UNSPLASH_SECRET_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  WEBHOOK_SECRET_USER_CREATED: z.string(),
  WEBHOOK_SECRET_USER_DELETED: z.string(),
  PUSHER_APP_KEY: z.string(),
  PUSHER_APP_CLUSTER: z.string(),
  PUSHER_APP_ID: z.string(),
  PUSHER_APP_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  STRIPE_SECRET_KEY_TEST: z.string(),
  STRIPE_SECRET_KEY_PROD: z.string(),
  CREDITS_150_ID_TEST: z.string(),
  CREDITS_400_ID_TEST: z.string(),
  CREDITS_1200_ID_TEST: z.string(),
  CREDITS_150_ID_PROD: z.string(),
  CREDITS_400_ID_PROD: z.string(),
  CREDITS_1200_ID_PROD: z.string(),
  STRIPE_WEBHOOK_SECRET_PROD: z.string(),
  STRIPE_WEBHOOK_SECRET_TEST: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string(),
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
  NEXT_PUBLIC_PUSHER_APP_CLUSTER: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  NEXT_PUBLIC_PUSHER_APP_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
};
