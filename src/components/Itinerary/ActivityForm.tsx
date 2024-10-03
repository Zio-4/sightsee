import React, { useState } from 'react'
import axios from 'axios';
import { SearchBox } from '@mapbox/search-js-react';
import { IActivityForm } from '../../types/itinerary';
import { triggerPusherEvent } from '../../lib/pusherEvent';
import useItineraryStore from '../../hooks/useItineraryStore';
import useMapStore from '../../hooks/useMapStore';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, PlusCircle, Sparkles } from 'lucide-react'
import useCreditsStore from '@/hooks/useCreditsStore'

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
    'width': '100%'
  },
}

const ActivityForm = React.memo(({ tripDayId }: IActivityForm) => {
    const [activityDetails, setActivityDetails] = useState({
        name: '',
        address: ''
    })
    const [searchBoxValue, setSearchBoxValue] = useState('');
    const [aiDescription, setAIDescription] = useState('');
    const [useAI, setUseAI] = useState(false)
    const map = useMapStore(state => state.map)
    const searchMarkerCoordinates = useMapStore(state => state.searchMarkerCoordinates)
    const setSearchMarkerCoordinates = useMapStore(state => state.setSearchMarkerCoordinates)
    const itinerary = useItineraryStore(state => state.itinerary)
    const addActivity = useItineraryStore(state => state.addActivity)
    const { user } = useUser()
    const { credits } = useCreditsStore()
    const hasEnoughCredits = credits >= 1

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
    
        const activityFormValues = {
            name: activityDetails.name,
            startTime: null,
            endTime: null,
            contactInfo: '',
            note: '',
            address: activityDetails.address,
            tripDayId: tripDayId,
            longitude: searchMarkerCoordinates[0],
            latitude: searchMarkerCoordinates[1],
            useAI: useAI
        }

        let res = null

        try {
            res = await axios.post('/api/activities', activityFormValues)
            toast.success('Activity added', {
                duration: 3000,
                position: 'top-right',
            });
            addActivity(res.data.id, tripDayId, res.data)
            setUseAI(false)
        } catch (error) {
            console.error(error)
            toast.error('There was a problem adding the activity. Please try again', {
                duration: 3000,
                position: 'top-right',
            });
        }

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

    const handleCreateAIActivity = async () => {
        if (!hasEnoughCredits) {
            toast.error('Not enough credits to generate AI activity', {
                duration: 3000,
                position: 'top-right',
            });
            return;
        }

        setUseAI(true)

        const activityFormValues = {
            aiDescription: aiDescription,
            tripDayId: tripDayId,
            useAI: useAI
        }

        let res = null

        try {
            res = await axios.post('/api/activities', activityFormValues)
            toast.success('Activity added', {
                duration: 3000,
                position: 'top-right',
            });
            addActivity(res.data.id, tripDayId, res.data)
            setUseAI(false)
        } catch (error) {
            console.error(error)
            toast.error('There was a problem adding the activity. Please try again', {
                duration: 3000,
                position: 'top-right',
            });
        }

        if (res && itinerary.collaborationId) {
            await triggerPusherEvent(`itinerary-${itinerary.id}`, 'itinerary-event-name', {
                ...res.data,
                entity: 'activity',
                action: 'create'
            })
        }

        // Implement AI activity generation logic here
        console.log("Generating AI activity with description:", aiDescription);
        // After generating, you might want to set the activity details and create the activity
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Add Activity</h3>
            <Tabs defaultValue="location">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai"><Sparkles className="h-4 w-4 mr-1" />Generate</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="location">
                    <div className="flex items-center space-x-2">
                        <MapPin className="text-gray-400" />
                        {map && (
                            <SearchBox 
                                accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
                                map={map} 
                                value={searchBoxValue} 
                                onChange={(text) => setSearchBoxValue(text)}
                                onRetrieve={handleRetrieve}
                                theme={searchBoxStyling}
                            />
                        )}
                        <Button onClick={createActivity}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="ai">
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Describe the activity you want..."
                            value={aiDescription}
                            onChange={(e) => setAIDescription(e.target.value)}
                            rows={3}
                        />
                        <Button 
                            onClick={handleCreateAIActivity} 
                            className={`w-full `}
                            disabled={!hasEnoughCredits}
                        >
                            <Sparkles className="mr-2 h-4 w-4" /> <span className={`${hasEnoughCredits ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400' : ''}`}>Generate Activity</span>
                        </Button>
                        {!hasEnoughCredits && (
                            <p className="text-xs text-slate-500 mt-1 text-center">
                                Not enough credits to generate activity with AI
                            </p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
})

export default ActivityForm
