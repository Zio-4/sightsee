import Pusher from "pusher";
import { NextApiRequest, NextApiResponse } from "next";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Trigger a Pusher event
    const { message } = req.body;

    console.log(message);

    await pusher.trigger('test-channel', 'test-updated', {
      data: message
    });

    return res.status(200).json({ message: 'Message sent successfully' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
