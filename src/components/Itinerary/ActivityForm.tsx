import React, { useState } from 'react'
import axios from 'axios';
import { SearchBox,  } from '@mapbox/search-js-react';
import { IActivityForm } from '../../types/itinerary';
import { triggerPusherEvent } from '../../lib/pusherEvent';
import { useItineraryContext } from '../../hooks/useItineraryContext'
import { set } from 'date-fns';

const searchBoxStyling = {
    variables: {
        borderRadius: '0.5rem',
        // border: '3px solid #eee',
        opacity: '40%',
        outlineStyle: 'none',
    }
}
// 'bg-white bg-opacity-40 rounded-md p-1 outline-none w-full h-fit mr-2'


const ActivityForm = React.memo(({ tripDayId, }: IActivityForm) => {
    const [activityDetails, setActivityDetails] = useState({
        name: '',
        address: ''
    })
    const [searchBoxValue, setSearchBoxValue] = useState('');
    const { state: { itinerary, map, searchMarkerCoordinates }, dispatch } = useItineraryContext()
    const [showToast, setShowToast] = useState({
        state: false,
        message: ''
    })

    // To add activity
    // const setDebounceRef = useSetAtom(debouncRefAtom)

    const createAcitivity = async () => {
        if (activityDetails.name.length === 0) return

        setSearchBoxValue('')

        // Does this make sense?
        // Map coordinates don't need to change unless you search for a new location
        // dispatch({ type: 'UPDATE_SEARCH_MARKER_COORDINATES', payload: searchMarkerCoordinates})
    
        const activityFormValues = {
            name: activityDetails.name,
            startTime: null,
            endTime: null,
            contactInfo: '',
            note: '',
            address: activityDetails.address,
            tripDayId: tripDayId,
            longitude: searchMarkerCoordinates[0],
            latitude: searchMarkerCoordinates[1]
        }

        let res = undefined

        try {
            res = await axios.post('/api/activities', activityFormValues)
            console.log('activity creation response:', res)
            setShowToast({state: true, message: 'Activity added'})        // Cannot update state before we have the activity id from the server
            setTimeout(() => setShowToast({state: false, message: ''}), 2000)
            dispatch({ type: 'ACTIVITY_ADD', payload: res.data })
        } catch (error) {
            console.error(error)
            setShowToast({state: true, message: 'There was a problem adding the activity. Please try again'})  
            setTimeout(() => setShowToast({state: false, message: ''}), 4000)
        }


        // trigger pusher event if collaboration
        if (res && itinerary.collaborationId) {
            await triggerPusherEvent(`itinerary-${itinerary.id}`, 'itinerary-event-name', {
                ...res.data,
                entity: 'activity',
                action: 'create'
            })
        }
    }

    const handleRetrieve = (res: any) => {
        dispatch({ type: 'UPDATE_SEARCH_MARKER_COORDINATES', payload: [res.features[0]?.properties.coordinates.longitude, res.features[0]?.properties.coordinates.latitude]})
        setActivityDetails({
            name: res.features[0].properties?.name_preferred || res.features[0].properties.name,
            address: res.features[0].properties?.full_address || ''
        })
    }


  return (
    <div className='text-black mt-3'>
        {showToast.state && (
            <div className="toast toast-top toast-start transition-transform duration-300 ease-in-out">
                <div className="alert alert-info shadow-lg text-white">
                    <span>{showToast.message}</span>
                </div>
            </div>)
        }

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
                className='btn btn-accent btn-xs sm:btn-sm'
            >
                Add activity
            </button>
        </div>

        {/* <p className='mt-2'>Notes:</p>
        <textarea className='text-black outline-none rounded-md w-1/2'/> */}
    </div>
  )
})

export default ActivityForm
