import React, { useState, } from 'react'
import axios from 'axios';
import { SearchBox,  } from '@mapbox/search-js-react';
import { IActivityForm } from '../../types/itinerary';
import { triggerPusherEvent } from '../../lib/pusherEvent';
import useItineraryStore from '../../hooks/useItineraryStore';
import useMapStore from '../../hooks/useMapStore';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const searchBoxStyling = {
  variables: {
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    borderRadius: '0.375rem',
    border: '1px solid hsl(var(--input))',
    backgroundColor: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
    padding: '0.5rem 0.75rem',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '::placeholder': {
      color: 'hsl(var(--muted-foreground))',
    },
    ':focus': {
      outline: 'none',
      ring: '2px',
      ringColor: 'hsl(var(--ring))',
      ringOffset: '2px',
    },
  },
}


const ActivityForm = React.memo(({ tripDayId, }: IActivityForm) => {
    const [activityDetails, setActivityDetails] = useState({
        name: '',
        address: ''
    })
    const [searchBoxValue, setSearchBoxValue] = useState('');
    const map = useMapStore(state => state.map)
    const searchMarkerCoordinates = useMapStore(state => state.searchMarkerCoordinates)
    const setSearchMarkerCoordinates = useMapStore(state => state.setSearchMarkerCoordinates)
    const itinerary = useItineraryStore(state => state.itinerary)
    const addActivity = useItineraryStore(state => state.addActivity)
    const { user } = useUser()


    console.log('map in activity form:', map)

    const createActivity = async () => {
        if (activityDetails.name.length === 0) return
        if (!user) {
            const guestActivities = JSON.parse(localStorage.getItem('guestActivitiesCreated') || '0')

            if (parseInt(guestActivities) === 4) {
                toast.error('You have reached the maximum number of activities for a guest itinerary. Please sign in to continue.', {
                    duration: 3000,
                    position: 'top-right',
                });
                return  
            } else {
                localStorage.setItem('guestActivitiesCreated', JSON.stringify(parseInt(guestActivities) ?? 0 + 1))
            }
        }

        setSearchBoxValue('')

        // Does this make sense?
        // Map coordinates don't need to change unless you search for a new location
    
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

        let res = null

        try {
            res = await axios.post('/api/activities', activityFormValues)
            console.log('activity creation response:', res)
            toast.success('Activity added', {
                duration: 3000,
                position: 'top-right',
            });
            addActivity(res.data.id, tripDayId, res.data)
        } catch (error) {
            console.error(error)
            toast.error('There was a problem adding the activity. Please try again', {
                duration: 3000,
                position: 'top-right',
            });
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
        setSearchMarkerCoordinates([res.features[0]?.properties.coordinates.longitude, res.features[0]?.properties.coordinates.latitude])
        
        setActivityDetails({
            name: res.features[0].properties?.name_preferred || res.features[0].properties.name,
            address: res.features[0].properties?.full_address || ''
        })
    }

    return (
        <Card className="mt-3">
            <CardHeader>
                <CardTitle>Add Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col space-y-4'>
                    {map && <div className='flex-grow'>
                        <SearchBox 
                            accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
                            map={map} 
                            value={searchBoxValue} 
                            onChange={(text) => setSearchBoxValue(text)}
                            onRetrieve={handleRetrieve}
                            theme={searchBoxStyling}
                        />
                    </div>}
                    <Button 
                        onClick={createActivity} 
                        name='activityButton' 
                        aria-label='add-activity-button' 
                    >
                        Add activity
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
})

export default ActivityForm
