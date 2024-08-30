import Link from 'next/link'
import React from 'react'
import { HeartIcon } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='sticky top-[100vh] bg-turquoise'>
      <p className='pb-4 text-center text-white'>
        Engineered with <HeartIcon className='inline-block h-4 w-4 text-red-500' /> by <Link href='https://x.com/Phil_Zio' 
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

