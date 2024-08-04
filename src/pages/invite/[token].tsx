import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@clerk/nextjs';
import { type GetServerSideProps } from 'next'
import { prisma } from '../../server/db/client'
import { getAuth, buildClerkProps, } from "@clerk/nextjs/server";
import { RedirectToSignUp } from '@clerk/nextjs';

function VerifyToken({ itineraryId }: { itineraryId: number }) {
    const router = useRouter()
    console.log('router:', router)

    // Check user if user is signed in
    // If not, redirect to sign in page
    const { user, isLoaded } = useUser()

    if (window) {
      if (!user) {
          localStorage.setItem('invite-token', JSON.stringify(router.query.token))
          // router.push('https://willing-doberman-19.accounts.dev/sign-up')
          RedirectToSignUp({redirectUrl: `/trips/${itineraryId}`})
      }
    }

    // Check if token is valid
    // If not, redirect to home page

    // Redirect to trip page

  return (
    <div>
        <p>You have been invited to join a trip!</p>
    </div>
  )
}

export default VerifyToken

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  const { token } = ctx.query;

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  // Check token is not invalid, expired, or already used
  const invite = await prisma.invite.findUnique({
    where: {
      token: token,
    }
  })

  console.log('invite response:', invite)

  // invalid token
  if (!invite) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  // Check if invite is expired
  const currentDate = new Date()
  const inviteExpiration = new Date(invite.expiration)

  if (currentDate > inviteExpiration) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  
  // Invite already used
  if (invite.status === 'ACCEPTED') {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  if (userId) {
    await prisma.invite.update({
      where: {
        token: token
      },
      data: {
        status: 'ACCEPTED'
      }
    })

    // create collaboration
    const res = await prisma.collaboration.create({
      data: {
        itinerary: {
          connect: { id: invite.itineraryId }
        },
        profile: {
          connect: { clerkId: userId }
        }
      }
    })

    // update original users itinerary
    await prisma.itinerary.update({
      where: {
        id: invite.itineraryId
      },
      data: {
        collaborationId: res.id
      }
    })

    // Add original user to collaboration
    await prisma.collaboration.update({
      where: {
        itineraryId: invite.itineraryId
      },
      data: {
        profile: {
          connect: { clerkId: userId }
        }
      }
    })

    console.log('collaboration created:', res)

    return {
      redirect: {
        destination: `/trips/${invite.itineraryId}`,
        permanent: false
      }
    }
  }

  return {
    props: {
      ...buildClerkProps(ctx.req), 
      itineraryId: invite.itineraryId
    }
  }
}