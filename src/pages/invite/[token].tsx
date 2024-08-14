import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@clerk/nextjs';
import { type GetServerSideProps } from 'next'
import { prisma } from '../../server/db/client'
import { getAuth, buildClerkProps, } from "@clerk/nextjs/server";
import { RedirectToSignUp, useSignUp, useClerk } from '@clerk/nextjs';

function VerifyToken({token}: { token: string }) {
    const router = useRouter()
    console.log('router:', router)

    // Check user if user is signed in
    // If not, redirect to sign in page
    const { user, isLoaded } = useUser()

    useEffect(() => {
      if (!user) {
          localStorage.setItem('invite-token', JSON.stringify(router.query.token))
          // router.push('https://willing-doberman-19.accounts.dev/sign-up')
          // RedirectToSignUp({redirectUrl: `/trips/${itineraryId}`})
      }
    }, [])

    // Check if token is valid
    // If not, redirect to home page

    // Redirect to trip page

  return (
    <div>
        <h1>You have been invited to join a trip!</h1>

        <RedirectToSignUp redirectUrl={`/invite/${token}`}/>
    </div>
  )
}

export default VerifyToken

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log('ctx:', ctx)
  const { userId } = getAuth(ctx.req);
  const { token }  = ctx.query;

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  if (!userId) {
    return {
      props: {
        ...buildClerkProps(ctx.req),
        token: token
      }
    }
  }

  console.log('token:', token)

  // Check token is not invalid, expired, or already used
  let invite: any
  try {
    invite = await prisma.invite.findUnique({
      where: {
        token: token as string,
      }
    })
  } catch (error) {
    // TODO: Let user know token is invalid or cannot be found
    console.error(error)
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }


  console.log('invite response:', invite)

  // invalid token
  if (!invite) {
    console.log('----------------invalid token--------------')
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  // Check if invite is expired
  const currentDate = new Date()
  console.log('expiration type on invite:', typeof invite.expiration)
  const inviteExpiration = new Date(invite.expiration)

  if (currentDate > inviteExpiration) {
    console.log('----------------expired token--------------')
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  
  // Invite already used
  if (invite.status === 'ACCEPTED') {
    console.log('----------------invite already used--------------')
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  if (userId) {
    try {
      const inviteUpdate = await prisma.invite.update({
        where: {
          token: token as string
        },
        data: {
          status: 'ACCEPTED'
        }
      })
      console.log('invite updated:', inviteUpdate)
  
      // create collaboration, add creator and tripmate to collaboration
      const createdCollaboration = await prisma.collaboration.create({
        data: {
          itinerary: {
            connect: { id: invite.itineraryId }
          },  
          profile: {
            connect: [{ clerkId: userId }, { clerkId: invite.senderUserId }]
          }
        }
      })
      console.log('collaboration created:', createdCollaboration)
  
      // update original users itinerary
      const itinUpdate = await prisma.itinerary.update({
        where: {
          id: invite.itineraryId
        },
        data: {
          collaborationId: createdCollaboration.id
        }
      })
      console.log('itinerary updated:', itinUpdate)
  
      // // Add original user to collaboration
      // const collabUpdate = await prisma.collaboration.update({
      //   where: {
      //     itineraryId: invite.itineraryId
      //   },
      //   data: {
      //     profile: {
      //       connect: { clerkId: invite.senderUserId }
      //     }
      //   }
      // })
      // console.log('collaboration updated:', collabUpdate)

    } catch (error) {
      console.error('Failed to create collaboration, update invite, or update itinerary:', error)
    }
    

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