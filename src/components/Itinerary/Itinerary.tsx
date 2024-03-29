import React from 'react'
import TripDay from './TripDay'
import format from 'date-fns/format';
import Image from 'next/image'
import { IItineraryData } from '../../types/itinerary';

const Itinerary = ({itin}: IItineraryData) => {

  return (
    <div className='bg-blue-100 shadow-xl shadow-black min-h-screen'>
        <Image src={itin.coverPhoto || 'https://commons.wikimedia.org/wiki/File:BlankMap-World.svg'} alt='Itinerary cover' width={300} height={200} priority={true} className='w-full h-80' />

        <div className='absolute top-20 left-4 bg-black rounded-lg p-2 bg-opacity-30'>
          <p className='text-2xl text-slate-50'>{itin.name}</p>
          <p>{itin.destinations}</p>
          <p>{format(new Date(itin.startDate), 'MMM d, yyyy')} - {format(new Date(itin.endDate), 'MMM d, yyyy')}</p>
          {/* <p className='text-right mt-7'>Username & Collaborators</p> */}
        </div>

        <div className='w-11/12 md:w-10/12 lg:w-11/2 mx-auto'>
            <div className='bg-inherit w-full mt-5 flex'>
                <div className='grid grid-cols-1 divide-y divide-white text-black w-full'>
                  {itin.tripDays.map((day) => {
                    return <TripDay key={day.id} date={new Date(day.date)} activities={day.activities} tripDayId={day.id} />
                  })}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Itinerary
