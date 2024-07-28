import React, { useRef, useState } from 'react'
// import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import ProfilePlaceholder from '../../assets/profile-placeholder.png'
import { useUser } from "@clerk/nextjs";
import { ITripCard } from '../../types/trips'
import { BsPersonPlusFill } from "react-icons/bs"
import axios from 'axios'
import { send } from 'micro'
import mod from 'zod/lib'

const TripCard = ({ title, startDate, endDate, collaborator, collaborators, id, destinations}: ITripCard) => {
    const { user } = useUser();
    const modalRef: any = useRef(null);
    const [email, setEmail] = useState('')
    const [isValid, setIsValid] = useState(true);

    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
  
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEmail = e.target.value;
      setEmail(newEmail);
      setIsValid(validateEmail(newEmail));
    };

    const clearState = () => {
        setEmail('')
        setIsValid(true)
        console.log('clear state')
    }

    const addTripMate = async () => {
        if (isValid) {
            try {
                await axios.post('/api/invite', {
                    inviteeEmail: email,
                    itineraryId: id,
                    senderEmail: user?.emailAddresses[0]?.emailAddress
                })
    
                console.log('invite sent')

                clearState()
                modalRef.current?.close()
            } catch (error) {
                console.error('Error sending invite:', error);
            }

        }
    }

  return (
    <div  className='bg-white bg-opacity-80 text-black mt-2 p-3 rounded-lg drop-shadow-lg max-w-m md:max-w-sm trip-card'>
        <Link href={{pathname:'/trips/[id]', query: { id: id.toString() }}} as={`/trips/${id.toString()}`}>
            <div className='flex justify-between'>
                <h3 className='text-xl'>{title} </h3>
                {/* <div>
                    <BsThreeDotsVertical size={20} className='mt-1 cursor-pointer'/>
                </div> */}
            </div>
            
            <p className='italic text-slate-500'>{destinations}</p>
            <p className='text-sm' title='itinerary-date'>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
            {collaborator && <div className="badge badge-accent">Collaborator</div>}
        </Link>
            
            {/* Profile images of collaborators */}
            <div className='flex justify-between mt-6'>
                <div className='flex'>
                    <Image src={user?.profileImageUrl || ProfilePlaceholder} alt='collaborator' height={30} width={30} className='rounded-full'/>
                    <FaUserCircle size={30}/>
                    <FaUserCircle size={30}/>
                    <FaUserCircle size={30}/>
                    <FaUserCircle size={30}/>
                </div>
                {/* <FaUserCircle size={30}/> */}
                <BsPersonPlusFill size={30} className='text-blue-400 hover:text-blue-500 cursor-pointer' onClick={()=>modalRef.current?.showModal()}/>
            </div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            {/* <button className="btn" onClick={()=>document.getElementById('my_modal_5').showModal()}>open modal</button> */}
            <dialog className="modal modal-bottom sm:modal-middle" ref={modalRef}>
                <div className="modal-box bg-slate-50">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={clearState} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-extrabold text-xl">Add Trip Mate</h3>
                    <p className="py-4">Enter the email address of the person you want to add to your trip.</p>
                    <input 
                      onChange={handleEmailChange}
                      type="email" 
                      name="email" 
                      placeholder="homelander@vought.com" 
                      required 
                      className={`input input-bordered w-full  bg-slate-50 ${!isValid && 'border-red-500'}`}
                    />
                    {!isValid && <p className="text-red-500 text-sm">Please enter a valid email address.</p>}
                    <div className='w-full flex justify-end mt-4'>
                        <button onClick={addTripMate} className="btn btn-success w-1/4">Add</button>
                    </div>
                </div>
            </dialog>
    </div>
  )
}

export default TripCard
