import Pusher from "pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: process.env.PUSHER_APP_CLUSTER!,
  useTLS: true
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId } = getAuth(req)
    const { channel, event, data } = req.body;

    console.log('request body:', req.body);

    const returnMsg = {
      ...data,
      userId
    }

    try {
      await pusher.trigger(channel, event, returnMsg);
    } catch (error) {
      console.error('Error:', error);
    }


    return res.status(200).json({ message: 'Message sent successfully', });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
