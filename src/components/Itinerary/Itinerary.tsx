import TripDay from './TripDay'
import format from 'date-fns/format';
import Image from 'next/image'
import { useItineraryContext } from '../../hooks/useItineraryContext'
import React from 'react';
import { useItinerarySelector } from '../../hooks/useItinerarySelector';


const Itinerary = React.memo(() => {
  const { state: { itinerary } } = useItineraryContext()
  const selectTripDays = (state: any) => state.tripDays;
  const tripDays = useItinerarySelector(selectTripDays);

  console.log(tripDays)

  // console.log('Rendering itinerary')

  return (
    <div>
      {itinerary.name && (
        <div className='bg-blue-100 shadow-xl shadow-black min-h-screen'>
            <Image src={itinerary.coverPhoto || 'https://commons.wikimedia.org/wiki/File:BlankMap-World.svg'} alt='Itinerary cover' width={300} height={200} priority={true} className='w-full h-80' />

            <div className='absolute top-20 left-4 bg-black rounded-lg p-2 bg-opacity-30'>
              <p className='text-2xl text-slate-50'>{itinerary.name}</p>
              <p>{itinerary.destinations}</p>
              <p>{format(new Date(itinerary.startDate), 'MMM d, yyyy')} - {format(new Date(itinerary.endDate), 'MMM d, yyyy')}</p>
              {/* <p className='text-right mt-7'>Username & Collaborators</p> */}
            </div>

            <div className='w-11/12 md:w-10/12 lg:w-11/2 mx-auto'>
                <div className='bg-inherit w-full mt-5 flex'>
                    <div className='grid grid-cols-1 divide-y divide-white text-black w-full'>
                      {Object.values(tripDays).map((tripDay) => {
                        return <TripDay
                                  tripDayId={tripDay.id}
                                  key={tripDay.id}
                                />
                      })}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  )
})

export default Itinerary
