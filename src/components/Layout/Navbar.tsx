import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import LayoutWrapper from './LayoutWrapper'
import ProfilePlaceholder from '../../assets/profile-placeholder.png'
import { CgMenu, CgClose } from 'react-icons/cg'
import GuestSignInButton from '../ui/GuestSignInButton'
import Modal from './Modal'
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Palmtree } from "lucide-react"

const Navbar = () => {
  const router = useRouter()
  const [toolTipHideState, setToolTipHideState] = useState(true)
  const [mobileMenuState, setMobileMenuState] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [path, setPath] = useState('')

  const { user, isSignedIn } = useUser()


  const toggleModal = () => {
    setIsOpen(!isOpen)
  }


  const handleNav = (path: string, isMobile: boolean) => {
    if (isMobile) {
      setMobileMenuState(!mobileMenuState)
    }

    if (router.pathname === '/trips/[id]' && !isSignedIn) {
      setIsOpen(true)
      setPath(path)
    } else {
      router.push(path)
    }
  }


  return (
    // <LayoutWrapper>
    <div className='bg-sandyBeige px-4'>
        <nav className='flex justify-between py-4 bg-sandyBeige text-oceanBlue'>
            <button onClick={() => handleNav('/', false)} className='font-bold text-2xl flex items-center'>
              <Palmtree className="h-6 w-6 text-turquoise mr-2" />
              <span>Sightsee</span>
            </button>
            {mobileMenuState ? (
                <div className='md:hidden'>
                  <CgClose onClick={() => setMobileMenuState(!mobileMenuState)} size={30} className='fixed right-10 text-coral z-[1002]'/>
                </div>
              ) : (
                <CgMenu onClick={() => setMobileMenuState(!mobileMenuState)} size={30} className='md:hidden text-oceanBlue'/>
              )
            }

            {/* Desktop menu */}
            <ul className='hidden md:flex space-x-8 items-center'>
                <li>
                  <button onClick={() => handleNav('/trips', false)} className={`${router.pathname === '/trips' && 'underline underline-offset-8 decoration-turquoise'} hover:underline hover:underline-offset-8`}>Trips</button>
                </li>
                <li>
                  <button onClick={() => handleNav('/discover', false)} className={`${router.pathname === '/discover' && 'underline underline-offset-8 decoration-turquoise'} hover:underline hover:underline-offset-8`}>Discover</button>
                </li>
            </ul>

            {/* Mobile menu */}
            <div className={`fixed right-0 top-0 h-screen w-3/5 bg-turquoise z-[1001] ${!mobileMenuState && 'hidden'} md:hidden`}>
              <div className='flex flex-col justify-around items-center h-full'>
                <div className='flex flex-col items-center'>
                    <ul className='space-y-10 text-3xl'>
                      <li>
                        <button onClick={() => handleNav('/', true)} className={`${router.pathname === '/' && 'underline underline-offset-8 decoration-sandyBeige'} hover:text-coral`}>Home</button>
                      </li>
                      <li>
                        <button onClick={() => handleNav('/trips', true)}  className={`${router.pathname === '/trips' && 'underline underline-offset-8 decoration-sandyBeige'} hover:text-coral`}>Trips</button>
                      </li>
                      <li>
                        <button onClick={() => handleNav('/discover', true)} className={`${router.pathname === '/discover' && 'underline underline-offset-8 decoration-sandyBeige'} hover:text-coral`}>Discover</button>
                      </li>
                    </ul>
                </div>
                {isSignedIn ? (
                  <div>
                    <div onClick={() => {
                      setMobileMenuState(!mobileMenuState)
                      router.push('/profile')
                    }} className='flex space-x-2'>
                      <p className={`text-3xl ${router.pathname === '/profile' && 'underline underline-offset-8 decoration-sandyBeige'}`}>Profile</p>
                      <Image src={user.profileImageUrl || ProfilePlaceholder} alt='profile avatar' width={40} height={40} className='inline-block rounded-full cursor-pointer'/>
                    </div>
                    <SignOutButton>
                      <button className='bg-coral text-white rounded-md py-2 px-10 mt-6 hover:bg-opacity-80'>Sign Out</button>
                    </SignOutButton>
                  </div>
                ): (
                  <GuestSignInButton isHidden={false}/>
                )
              }
                
              </div>
            </div>

            {isSignedIn ? (
                <div className='relative w-1.5/12 hidden md:flex justify-end' onMouseEnter={() => setToolTipHideState(!toolTipHideState)} onMouseLeave={() => setToolTipHideState(!toolTipHideState)} >
                    <div className='rounded-full'>
                      <Image  src={user.profileImageUrl || ProfilePlaceholder} alt='profile avatar' width={32} height={32} className='rounded-full cursor-pointer'/>
                    </div>

                    <div className='absolute z-10 right-0 top-8 w-[7rem]'>
                      <div className={`bg-white text-oceanBlue rounded-md p-3 ${toolTipHideState && 'hidden'}`}>
                          <div className='flex flex-col'>
                            <button onClick={() => router.push('/profile')} className='cursor-pointer hover:bg-turquoise hover:bg-opacity-10 text-center'>Profile</button>
                            <SignOutButton>
                              <button className='cursor-pointer hover:bg-turquoise hover:bg-opacity-10'>Sign Out</button>
                            </SignOutButton>
                          </div>
                      </div>
                    </div>
                </div>
            ) : (
              <GuestSignInButton isHidden={true}/>
            )}
      </nav>

      <Modal isOpen={isOpen} toggleModal={toggleModal} path={path}/>
    </div>
    // </LayoutWrapper>
  )
}

export default Navbar
