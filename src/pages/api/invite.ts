import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../server/db/client'
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from "@clerk/nextjs/server";

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
                expiration: new Date(Date.now() + 3600000), // Expire in 1 hour
                itineraryId: itineraryId,
                senderEmail: senderEmail,
                status: 'PENDING'
            }
        })

        // Send email to invitee
        const resend = require('resend');

        await resend.emails.send({
            from: 'Sightsee <onboarding@resend.dev>',
            to: inviteeEmail,
            subject: 'You have been invited to join a trip!',
            // text: `You have been invited to join a trip by ${senderEmail}. Click the link below to accept the invitation.`,
            html: `<p>You have been invited to join a trip by ${senderEmail}. Click the link below to accept the invitation.</p><a href="https://sightsee.vercel.app/accept-invite?token=${token}">Accept Invitation</a>`
        });

        res.status(201).json({ message: 'Invitation sent successfully.'})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'An error occurred while sending the invitation.'})
    }
}