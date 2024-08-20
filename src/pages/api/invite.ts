import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../server/db/client'
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from "@clerk/nextjs/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    // Check if user is signed in
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: 'NOT AUTHORIZED.'})
    }

    const { inviteeEmail, itineraryId, senderEmail } = req.body;

    if (!inviteeEmail) {
        return res.status(400).json({ error: 'Email is required.'})
    }

    try {
        const token = uuidv4();
        const inviteRes = await prisma.invite.create({
            data: {
                inviteeEmail: inviteeEmail,
                token: token,
                expiration: new Date(Date.now() + 604800000), // Expire in 1 week
                itineraryId: itineraryId,
                senderEmail: senderEmail,
                senderUserId: userId,
                status: 'PENDING'
            }
        })

        const emailResult = await resend.emails.send({
            from: 'Sightsee <onboarding@resend.dev>',
            to: inviteeEmail,
            subject: 'You have been invited to join a trip!',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Trip Invitation</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                        h1 { color: #2c3e50; }
                        .button { display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <h1>You've Been Invited to Join a Trip!</h1>
                    <p>Hello,</p>
                    <p>${senderEmail} has invited you to join their trip on Sightsee. Ready for an adventure?</p>
                    <p>Click the button below to accept the invitation and start planning together:</p>
                    <p>
                        <a href="${process.env.NODE_ENV === 'production' ? `https://sightsee.vercel.app/invite/${token}` : `http://localhost:3000/invite/${token}`}" class="button">Accept Invitation</a>
                    </p>
                    <p>If you have any questions, please don't hesitate to contact us.</p>
                    <p>Happy travels!</p>
                    <p>The Sightsee Team</p>
                </body>
                </html>
            `
        });

        if (emailResult.error) { 
            throw new Error(emailResult.error.message)
        }

        console.log('Email result:', emailResult)

        res.status(201).json({ message: 'Invitation sent successfully.'})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'An error occurred while sending the invitation.'})
    }
}
