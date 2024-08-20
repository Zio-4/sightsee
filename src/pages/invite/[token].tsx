import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { type GetServerSideProps } from 'next'
import { prisma } from '../../server/db/client'
import { getAuth, buildClerkProps, } from "@clerk/nextjs/server";
import { RedirectToSignUp, } from '@clerk/nextjs';
import useInviteStore from '../../hooks/useInviteStore';

type Status = 'NO TOKEN PROVIDED' | 
              'ERROR FETCHING INVITE' |
              'USER NOT SIGNED IN' |
              'NO INVITE FOUND' | 
              'INVITE EXPIRED' | 
              'INVITE ALREADY USED' | 
              'JOINED TRIP'

function VerifyToken({ token, status, itineraryId }: { token: string, status: Status, itineraryId: number }) {
    const router = useRouter()
    const setInviteError = useInviteStore(state => state.setErrorMessage)
    const setJoinedTrip = useInviteStore(state => state.setJoinedTrip)

    useEffect(() => {
      if (status === 'JOINED TRIP') {
        setJoinedTrip(true)
        router.push(`/trips/${itineraryId}`)
      } else {
        if (status === 'NO TOKEN PROVIDED') {
          setInviteError('No invite token provided')
        } else if (status === 'ERROR FETCHING INVITE') {
          setInviteError('Error fetching the invite. Please try again.')
        } else if (status === 'NO INVITE FOUND') {
          setInviteError('Invitation not found. Please try again.')
        } else if (status === 'INVITE EXPIRED') {
          setInviteError('Invitation has expired.')
        } else if (status === 'INVITE ALREADY USED') {
          setInviteError('Invitation has already been accepted.')
        }
        router.push('/')
      }
    }, [])

  return (
    <div>
        <h1 className='text-center text-4xl font-bold mt-20'>{status === 'USER NOT SIGNED IN' ? 'You have been invited to join a trip!' : status}</h1>

        {status === 'USER NOT SIGNED IN' && <RedirectToSignUp redirectUrl={`/invite/${token}`}/>}
    </div>
  )
}

export default VerifyToken

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  const { token }  = ctx.query;

  if (!token) {
    return {
      props: {
        ...buildClerkProps(ctx.req),
        token: token,
        status: 'NO TOKEN PROVIDED'
      }
    }
  }

  if (!userId) {
    return {
      props: {
        ...buildClerkProps(ctx.req),
        token: token,
        status: 'USER NOT SIGNED IN'
      }
    }
  }

  // Check token is not invalid, expired, or already used
  let invite: any
  try {
    invite = await prisma.invite.findUnique({
      where: {
        token: token as string,
      }
    })
  } catch (error) {
    console.error(error)
    return {
      props: {
        ...buildClerkProps(ctx.req),
        token: token,
        status: 'ERROR FETCHING INVITE'
      }
    }
  }

  // invalid token
  if (!invite) {
    console.log('----------------invalid token--------------')
    return {
      props: {
        ...buildClerkProps(ctx.req),
        token: token,
        status: 'NO INVITE FOUND'
      }
    }
  }

  // Check if invite is expired
  const currentDate = new Date()
  const inviteExpiration = new Date(invite.expiration)

  if (currentDate > inviteExpiration) {
    return {
      props: {
        ...buildClerkProps(ctx.req),
        token: token,
        status: 'INVITE EXPIRED'
      }
    }
  }
  
  // Invite already used
  if (invite.status === 'ACCEPTED') {
    return {
      props: {
        ...buildClerkProps(ctx.req),
        token: token,
        status: 'INVITE ALREADY USED'
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
  
      // create collaboration, add creator and tripmate to collaboration
      const createdCollaboration = await prisma.collaboration.upsert({
        where: {
          itineraryId: invite.itineraryId
        },
        update: {
          itinerary: {
            connect: { id: invite.itineraryId }
          },  
          profile: {
            connect: [{ clerkId: userId }, { clerkId: invite.senderUserId }]
          }
        },
        create: {
          itinerary: {
            connect: { id: invite.itineraryId }
          },  
          profile: {
            connect: [{ clerkId: userId }, { clerkId: invite.senderUserId }]
          }
        },
      })
  
      // update original users itinerary
      const itinUpdate = await prisma.itinerary.update({
        where: {
          id: invite.itineraryId
        },
        data: {
          collaborationId: createdCollaboration.id
        }
      })

    } catch (error) {
      console.error('Failed to create collaboration, update invite, or update itinerary:', error)
      throw error
    }
    

    return {
      props: {
        ...buildClerkProps(ctx.req), 
        itineraryId: invite.itineraryId,
        status: 'JOINED TRIP'
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
