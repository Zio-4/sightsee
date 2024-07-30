import React from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@clerk/nextjs';

function VerifyToken() {
    const router = useRouter()
    console.log('router:', router)

    // Check user if user is signed in
    // If not, redirect to sign in page
    const { user, isLoaded } = useUser()

    if (!user) {
        localStorage.setItem('invite-token', 'token goes here')
        router.push('https://willing-doberman-19.accounts.dev/sign-up')
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