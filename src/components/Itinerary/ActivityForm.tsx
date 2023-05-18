import React, { useState } from 'react'
import axios from 'axios';
import { SearchBox } from '@mapbox/search-js-react';
import { useAtomValue } from 'jotai';
import { mapAtom } from '../../store';
import { IActivityForm } from '../../types/itinerary';


const ActivityForm = ({setActivitiesState, tripDayId, }: IActivityForm) => {
    const [activityName, setActivityName] = useState('')
    const mapInstance = useAtomValue(mapAtom)  

    const createAcitivity = async () => {
        if (activityName.length === 0) return
    
        const call = await axios.post('/api/activities', {
            activityName: activityName,
            activityContactInfo: '',
            activityNote: '',
            activityStreet: '',
            activityPostalCode: '',
            activityCity: '',
            activityCountry: '',
            tripDayId: tripDayId
        })

        console.log(call.data)

        setActivityName('')

        setActivitiesState((prev) => [...prev, call.data])
    }


  return (
    <div className='text-black mt-3'>

        <div className='flex justify-between'>
            <input type={'text'} value={activityName} aria-label='activity-name-input' onChange={(e) => setActivityName(e.target.value)} placeholder='Ex. Eiffel Tower' className='rounded-md p-1 w-1/2 focus:ring-0 focus:ring-offset-0 text-black border-0'/>
            <button onClick={createAcitivity} name='activityButton' aria-label='add-activity-button' className='bg-teal-300 py-1 px-2 rounded-lg text-black hover:bg-teal-500'>Add activity</button>
        </div>

        {/* @ts-ignore */}
        <SearchBox accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!} map={mapInstance}/>

        {/* <p className='mt-2'>Notes:</p>
        <textarea className='text-black outline-none rounded-md w-1/2'/> */}
    </div>
  )
}

export default ActivityForm
