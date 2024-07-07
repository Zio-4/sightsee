import React, { useState } from 'react'
import axios from 'axios';
import format from 'date-fns/format';
import Activity from './Activity'
import dynamic from 'next/dynamic'
import { tr } from 'date-fns/locale';
import { useItineraryContext } from '../../hooks/useItineraryContext'
import { useItinerarySelector } from '../../hooks/useItinerarySelector';

// SearchBox component requires the document
const ActivityForm = dynamic(() => import('../Itinerary/ActivityForm'), { ssr: false })


const TripDay = React.memo(({ tripDayId }: {tripDayId: number}) => {
    const { state: { tripDays } } = useItineraryContext()
    const tripDay = tripDays[tripDayId.toString()]

    const activities = useItinerarySelector((state) => {
        return Object.values(state.activities).filter(
          (activity) => activity.tripDayId === tripDay.id
        );
      });

    const [ readOnly, setReadOnly ] = useState(true);

    const deleteActivity = async (activityId: number, activityCoordinates: [number, number]) => {
        const call = await axios.delete('/api/activities', { 
           data: { activityId: activityId } 
        })
        // setActivitiesState((prev) => prev.filter(act => act.id !== activityId))
        // removeActivity(activityId, tripDayId, activityCoordinates)

        // setActivityCoordinatesState((prev) => {
        //     const updatedCoordinatesState = [...prev];

        //     for (let i = 0; i < updatedCoordinatesState.length; i++) {
        //         if (updatedCoordinatesState[i]![0] === activityCoordinates[0] &&
        //             updatedCoordinatesState[i]![1] === activityCoordinates[1]) {
        //             updatedCoordinatesState.splice(i, 1);
        //             return updatedCoordinatesState;
        //         }
        //     }

        //     return updatedCoordinatesState; // Return the updated state if no coordinates were removed
        // })
    }
    console.log(`Rendering trip day: ${tripDayId}`)

  return (
    <div className='w-full p-3 text-black'>
        <div className='flex justify-between'>
            <p className='mb-3 text-xl font-semibold'>{tripDay ? format(new Date(tripDay.date), 'MMM do') : ''}</p>
        </div>

        <div className='space-y-3'>
        {activities.length > 0 &&
        (activities.map((activity) => {
                return <Activity
                            activity={activity}
                            tripDayId={tripDayId}
                            key={activity.id} 
                        />
            })
        )
        }
        </div>
    
        <ActivityForm tripDayId={tripDayId} />
    </div>
  )
})

export default TripDay
