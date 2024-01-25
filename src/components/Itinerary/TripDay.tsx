import React, { 
    use,
    useState,
    useCallback 
} from 'react'
import axios from 'axios';
import { useEffect } from 'react';
// import ActivityForm from './ActivityForm';
import format from 'date-fns/format';
import Activity from './Activity'
import dynamic from 'next/dynamic'
// import { ITripDay } from '../../types/itinerary';
import { useAtom, useAtomValue } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { splitAtom } from 'jotai/utils';
import { 
    activityCoordinatesAtom, 
    removeActivity,
    tripDaysAtom,
} from '../../atomStore';
import { tr } from 'date-fns/locale';

// SearchBox component requires the document
const ActivityForm = dynamic(() => import('../Itinerary/ActivityForm'), { ssr: false })


// {date, activities, tripDayId,}: ITripDay
const TripDay = ({ tripDayId }: {tripDayId: number}) => {
    const [tripDays] = useAtom(tripDaysAtom)
    const tripDay = tripDays[tripDayId.toString()]

    const [ readOnly, setReadOnly ] = useState(true);
    // const [activitiesState, setActivitiesState] = useState(activities)
    const [activityCoordinatesState, setActivityCoordinatesState] = useAtom(activityCoordinatesAtom)

    const deleteActivity = async (activityId: number, activityCoordinates: [number, number]) => {
        const call = await axios.delete('/api/activities', { 
           data: { activityId: activityId } 
        })

        // setActivitiesState((prev) => prev.filter(act => act.id !== activityId))
        removeActivity(activityId, tripDayId, activityCoordinates)

        setActivityCoordinatesState((prev) => {
            const updatedCoordinatesState = [...prev];

            for (let i = 0; i < updatedCoordinatesState.length; i++) {
                if (updatedCoordinatesState[i]![0] === activityCoordinates[0] &&
                    updatedCoordinatesState[i]![1] === activityCoordinates[1]) {
                    updatedCoordinatesState.splice(i, 1);
                    return updatedCoordinatesState;
                }
            }

            return updatedCoordinatesState; // Return the updated state if no coordinates were removed
        })
    }

    function formattedDate() {
        if (tripDay?.date) {
            return format(tripDay.date, 'MMM do');
        }
        return "Date not available";
    }
    

  return (
    <div className='w-full p-3 text-black'>
        <div className='flex justify-between'>
            <p className='mb-3 text-xl font-semibold'>{tripDay ? format(new Date(tripDay.date), 'MMM do') : ''}</p>
        </div>

        <div className='space-y-3'>
        {tripDay?.activities &&
         tripDay?.activities.length > 0 &&
        (tripDay?.activities.map((activityId: number) => {
                return <Activity
                            activityId={activityId}
                            tripDayId={tripDayId}
                            key={activityId} 
                            // readOnly={readOnly} 
                            // setReadOnly={setReadOnly} 
                            // deleteActivity={deleteActivity}
                            // contactInfo={act.contactInfo}
                            // endTime={act.endTime}
                            // id={act.id}
                            // name={act.name}
                            // note={act.note}
                            // photo={act.photo}
                            // address={act.address}
                            // startTime={act.startTime}
                            // longitude={act.longitude}
                            // latitude={act.latitude}
                            // tripDayId={act.tripDayId}
                        />
            })
        )
        }
        </div>
    
        <ActivityForm tripDayId={tripDayId} />
    </div>
  )
}

export default TripDay
