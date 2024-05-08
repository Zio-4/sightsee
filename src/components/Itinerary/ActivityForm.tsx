import React, { useState } from 'react'
import axios from 'axios';
import { SearchBox,  } from '@mapbox/search-js-react';
import { IActivityForm } from '../../types/itinerary';
import { triggerPusherEvent } from '../../lib/pusherEvent';
import { useItineraryContext } from '../../hooks/useItineraryContext'

const searchBoxStyling = {
    variables: {
        borderRadius: '0.5rem'
    }
}


const ActivityForm = ({ tripDayId, }: IActivityForm) => {
    const [activityDetails, setActivityDetails] = useState({
        name: '',
        address: ''
    })
    const [searchBoxValue, setSearchBoxValue] = useState('');
    const { state: { itinerary, map, searchMarkerCoordinates }, dispatch } = useItineraryContext()
    
    // To add activity
    // const tripDays = useAtomValue(tripDaysAtom)
    // const setActivities = useSetAtom(activitiesAtom)
    // const setDebounceRef = useSetAtom(debouncRefAtom)

    const createAcitivity = async () => {
        if (activityDetails.name.length === 0) return

        setSearchBoxValue('')

        // Does this make sense?
        dispatch({ type: 'SET_SEARCH_MARKER_COORDINATES', payload: searchMarkerCoordinates})
    
        const activityFormValues = {
            name: activityDetails.name,
            contactInfo: '',
            note: '',
            address: activityDetails.address,
            tripDayId: tripDayId,
            longitude: searchMarkerCoordinates[0],
            latitude: searchMarkerCoordinates[1]
        }

        const res = await axios.post('/api/activities', activityFormValues)
        console.log('activity creation response:', res)

        // Cannot update state before we have the activity id from the server
        // addActivity(
        //     res.data, 
        //     tripDays, 
        //     setActivities, 
        //     setDebounceRef, 
        //     setActivityCoordinates
        // )

        // trigger pusher event
        await triggerPusherEvent(`itinerary-${itinerary.id}`, 'itinerary-event-name', {
            ...res.data,
            entity: 'activity',
            action: 'create'
        })
    }

    const handleRetrieve = (res: any) => {
        dispatch({ type: 'SET_SEARCH_MARKER_COORDINATES', payload: [res.features[0]?.properties.coordinates.longitude, res.features[0]?.properties.coordinates.latitude]})
        setActivityDetails({
            name: res.features[0].properties?.name_preferred || res.features[0].properties.name,
            address: res.features[0].properties?.full_address || ''
        })
    }


  return (
    <div className='text-black mt-3'>
        <div className='flex justify-between'>
            <div className='w-2/3'>
                <SearchBox 
                    accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
                    // @ts-ignore
                    map={map} 
                    value={searchBoxValue} 
                    onChange={(text) => setSearchBoxValue(text)}
                    onRetrieve={handleRetrieve}
                    theme={searchBoxStyling}
                />
            </div>
            {/* <input 
                type={'text'} 
                value={activityName}
                aria-label='activity-name-input' 
                onChange={(e) => setActivityName(e.target.value)} 
                placeholder='Ex. Eiffel Tower' 
                className='rounded-md p-1 w-1/2 focus:ring-0 focus:ring-offset-0 text-black border-0'
            /> */}
            <button 
                onClick={createAcitivity} 
                name='activityButton' 
                aria-label='add-activity-button' 
                className='bg-teal-300 py-1 px-2 rounded-lg text-black hover:bg-teal-500'
            >
                Add activity
            </button>
        </div>

        {/* <p className='mt-2'>Notes:</p>
        <textarea className='text-black outline-none rounded-md w-1/2'/> */}
    </div>
  )
}

export default ActivityForm
