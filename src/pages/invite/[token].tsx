import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@clerk/nextjs';
import { type GetServerSideProps } from 'next'
import { prisma } from '../../server/db/client'

function VerifyToken() {
    const router = useRouter()
    console.log('router:', router)

    // Check user if user is signed in
    // If not, redirect to sign in page
    const { user, isLoaded } = useUser()

    if (window) {
      if (!user) {
          localStorage.setItem('invite-token', 'token goes here')
          router.push('https://willing-doberman-19.accounts.dev/sign-up')
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
  const { token } = ctx.query;

  if (token) {
    return {
      redirect: {
        destination: '/trips',
        permanent: false
      }
    }
  }

  // Check token is not invalid, expired, or already used
  const invite = await prisma.invite.findUnique({
    where: {
      token: token
    }
  })

  return {
    props: {}
  }
}