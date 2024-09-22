export const STRIPE_PAYMENT_WEBHOOK_SECRET = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production' ? process.env.STRIPE_PAYMENT_WEBHOOK_SECRET_PROD : process.env.STRIPE_PAYMENT_WEBHOOK_SECRET_TEST;
export const STRIPE_SECRET_KEY = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production' ? process.env.STRIPE_SECRET_KEY_PROD : process.env.STRIPE_SECRET_KEY_TEST;