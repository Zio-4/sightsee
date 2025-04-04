import React, { useState } from 'react'
import format from 'date-fns/format';
import Activity from './Activity'
import dynamic from 'next/dynamic'
import useItineraryStore from '../../hooks/useItineraryStore';


// SearchBox component requires the document
const ActivityForm = dynamic(() => import('../Itinerary/ActivityForm'), { ssr: false })


const TripDay = React.memo(({ tripDayId }: {tripDayId: number}) => {
    const tripDays = useItineraryStore(state => state.tripDays)
    const tripDay = tripDays[tripDayId]

  return (
    <div className='w-full p-3 text-black'>
        <div className='flex justify-between'>
            <p className='mb-3 text-xl font-semibold'>{tripDay ? format(new Date(tripDay.date), 'MMM do') : ''}</p>
        </div>

        <div className='space-y-3'>
        {tripDay.activities.length > 0 &&
        (tripDay.activities.map((activityId: string) => {
                return <Activity
                            activityId={parseInt(activityId)}
                            tripDayId={tripDayId}
                            key={activityId}
                        />
            })
        )
        }
        </div>
    
        <ActivityForm tripDayId={tripDayId} destination={tripDay.destination} destinationId={tripDay.destinationId}/>
    </div>
  )
})

export default TripDay
