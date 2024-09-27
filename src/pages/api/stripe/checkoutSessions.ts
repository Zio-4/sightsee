import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { STRIPE_SECRET_KEY } from '../../../server/constants';

const stripe = new Stripe(STRIPE_SECRET_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {

    const { creditSelection, profileId } = req.body;

    const ENV = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production' ? 'PROD' : 'TEST';

    const priceId = process.env[`CREDITS_${creditSelection}_ID_${ENV}`] as string

    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/credits/?success=true`,
        cancel_url: `${req.headers.origin}/credits/?canceled=true`,
        client_reference_id: profileId,
      });

      res.json({ url: session.url });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
