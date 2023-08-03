import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='sticky top-[100vh]'>
      <p className='pb-5 text-center'>
        Made with ♡ by <Link href='https://www.linkedin.com/in/philipziolkowski/' 
                            rel="noopener noreferrer" 
                            target="_blank" 
                            className='font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-rose-500 text-lg'>
                              Philip Ziolkowski
                        </Link>
      </p>
    </footer>
  )
}

export default Footer

