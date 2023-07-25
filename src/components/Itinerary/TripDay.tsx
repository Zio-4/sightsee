import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios';
// import ActivityForm from './ActivityForm';
import format from 'date-fns/format';
import Activity from './Activity'
import dynamic from 'next/dynamic'
import { ITripDay } from '../../types/itinerary';
import { useAtom } from 'jotai';
import { activityCoordinatesAtom } from '../../atomStore';

// SearchBox component requires the document
const ActivityForm = dynamic(() => import('../Itinerary/ActivityForm'), {ssr: false})

const TripDay = ({date, activities, tripDayId,}: ITripDay) => {
    const [ readOnly, setReadOnly ] = useState(true);
    const [activitiesState, setActivitiesState] = useState(activities)
    const [activityCoordinatesState, setActivityCoordinatesState] = useAtom(activityCoordinatesAtom)

    const deleteActivity = async (activityId: number, activityCoordinates: [number | undefined, number | undefined]) => {
        const call = await axios.delete('/api/activities', { 
           data: { activityId: activityId } 
        })

        setActivitiesState((prev) => prev.filter(act => act.id !== activityId))

        setActivityCoordinatesState((prev) => {
            const updatedCoordinatesState = [...prev];

            for (let i = 0; i < updatedCoordinatesState.length; i++) {
                if (updatedCoordinatesState[i]![0] === activityCoordinates[0] && updatedCoordinatesState[i]![1] === activityCoordinates[1]) {
                    updatedCoordinatesState.splice(i, 1);
                    return updatedCoordinatesState;
                }
            }

            return updatedCoordinatesState; // Return the updated state if no coordinates were removed
        })
    }


  return (
    <div className='w-full p-3 text-black'>
        <div className='flex justify-between'>
            <p className='mb-3 text-xl font-semibold'>{format(date, 'MMM do')}</p>
        </div>

        <div className='space-y-3'>
        {activitiesState.length > 0 && (
            activitiesState.map(act => {
                return <Activity
                            key={act.id} 
                            readOnly={readOnly} 
                            setReadOnly={setReadOnly} 
                            deleteActivity={deleteActivity}
                            contactInfo={act.contactInfo}
                            endTime={act.endTime}
                            id={act.id}
                            name={act.name}
                            note={act.note}
                            photo={act.photo}
                            address={act.address}
                            startTime={act.startTime}
                            longitude={act.longitude}
                            latitude={act.latitude}
                            tripDayId={act.tripDayId}
                        />
            })
        )}
        </div>
    
        <ActivityForm  setActivitiesState={setActivitiesState} tripDayId={tripDayId} />
    </div>
  )
}

export default TripDay
