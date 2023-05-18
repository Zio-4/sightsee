import React from 'react'
import format from 'date-fns/format';
import ViewActivity from './ViewActivity';
import { ITripDay } from '../../types/itinerary';

const ViewTripDay = ({date, activities, tripDayId}: ITripDay) => {

  return (
    <div className='w-full p-3 text-black'>
        <div className='flex justify-between'>
            <p className='mb-3 text-xl font-semibold'>{format(date, 'MMM do')}</p>
        </div>

        <div className='space-y-8'>
            {activities.map(act => {
                return <ViewActivity
                            key={act.id} 
                            city={act.city}
                            contactInfo={act.contactInfo}
                            country={act.country}
                            endTime={act.endTime}
                            id={act.id}
                            name={act.name}
                            photo={act.photo}
                            postalCode={act.postalCode}
                            startTime={act.startTime}
                            street={act.street}
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
