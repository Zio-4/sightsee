import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='sticky top-[100vh]'>
      <p className='pb-5 text-center'>
        Engineered with ♡ by <Link href='https://x.com/Phil_Zio' 
                            rel="noopener noreferrer" 
                            target="_blank" 
                            className='font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 text-lg'>
                              Phil Ziolkowski
                        </Link>
      </p>
    </footer>
  )
}

export default Footer

