import React from 'react'
import format from 'date-fns/format';
import ViewActivity from './ViewActivity';
import { ITripDay } from '../../types/itinerary';

const ViewTripDay = ({date, activities, tripDayId}: ITripDay) => {

    console.log(activities)

  return (
    <div className='w-full p-3 text-black'>
        <div className='flex justify-between'>
            <p className='mb-3 text-xl font-semibold'>{format(date, 'MMM do')}</p>
        </div>

        <div className='space-y-8'>
            {activities.map(act => {
                return <ViewActivity
                            key={act.id} 
                            address={act.address}
                            longitude={act.longitude}
                            latitude={act.latitude}
                            contactInfo={act.contactInfo}
                            endTime={act.endTime}
                            id={act.id}
                            name={act.name}
                            photo={act.photo}
                            startTime={act.startTime}
                            note={act.note}
                            tripDayId={act.tripDayId}
                        />
                    }
                )
            }
        </div>
    </div>
  )
}

export default ViewTripDay
