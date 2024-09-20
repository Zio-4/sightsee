import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { prisma } from '../../../server/db/client';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const endpointSecret = "whsec_e4f8adf048e2d9f76518bf16c6d5fbb057b69cb2ef337712d111817998dc70c7";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Correctly handle being called multiple times with the same Checkout Session ID.
// Record fulfillment status for the provided Checkout Session.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillCheckout(session.id);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}


const tempPriceToProductMap = {
  '20': 1200,
  '10': 400,
  '5': 150,
}


async function fulfillCheckout(sessionId: string) {
  console.log('Fulfilling Checkout Session:', sessionId);

  try {
    // Use a transaction to ensure all operations are atomic (all must complete or none).
    const result = await prisma.$transaction(async (tx) => {
      // Check if fulfillment has already been performed
      const existingPayment = await tx.payment.findUnique({
        where: { stripePaymentId: sessionId },
      });

      if (existingPayment) {
        console.warn('Payment already processed for session:', sessionId);
        return null;
      }

      // Retrieve the Checkout Session from the API with line_items expanded
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items'],
      });

      console.log('products:', checkoutSession.line_items);

      if (checkoutSession.payment_status === 'paid') {
        const profileId = checkoutSession.client_reference_id;
        if (!profileId) {
          throw new Error('No profile ID found in the session');
        }

        // Create Payment record
        const payment = await tx.payment.create({
          data: {
            profileId,
            amount: checkoutSession.amount_total! / 100, // Convert cents to dollars
            currency: checkoutSession.currency,
            status: 'COMPLETED',
            stripePaymentId: sessionId,
          },
        });

        console.log('Payment amount:', payment.amount);

        // Calculate credits based on the payment amount
        const creditsToAdd = tempPriceToProductMap[payment.amount.toString() as keyof typeof tempPriceToProductMap];
        if (!creditsToAdd) {
          throw new Error(`Invalid payment amount: ${payment.amount}`);
        }

        console.log('Credits to add:', creditsToAdd);

        // Create CreditPurchase record
        await tx.creditPurchase.create({
          data: {
            profileId,
            amount: creditsToAdd,
            paymentId: payment.id,
          },
        });

        // Update user's credits
        await tx.profile.update({
          where: { clerkId: profileId },
          data: {
            credits: {
              increment: creditsToAdd,
            },
          },
        });

        console.log('Fulfillment completed for session:', sessionId);
        return payment;
      }

      console.log('Payment not completed for session:', sessionId);
      return null;
    });

    if (result) {
      console.log('Fulfillment processed successfully:', result);
    }
  } catch (error) {
    console.error('Error fulfilling checkout:', error);
    // Add some retry logic here 
    throw error; // Re-throw the error to be handled by the caller
  }
}
