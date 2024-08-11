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
        console.log('invite created:', inviteRes)

        const emailResult = await resend.emails.send({
            from: 'Sightsee <onboarding@resend.dev>',
            to: inviteeEmail,
            subject: 'You have been invited to join a trip!',
            // text: `You have been invited to join a trip by ${senderEmail}. Click the link below to accept the invitation.`,
            html: `<p>
                    You have been invited to join a trip by ${senderEmail}. Click the link below to accept the invitation.
                   </p>
                   <a href="${process.env.NODE_ENV === 'production' ? `https://sightsee.vercel.app/invite/${token}` : `http://localhost:3000/invite/${token}`}">Accept Invitation</a>`
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
