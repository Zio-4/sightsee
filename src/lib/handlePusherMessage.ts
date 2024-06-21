import { useItineraryContext } from "../hooks/useItineraryContext"

// Add functions to be passed in 
export function useHandlePusherMessage(msg: any) {
    const { dispatch } = useItineraryContext()

    const { entity, action, ...data } = msg

    if (entity === 'activity') {
        if (action === 'create') {
            dispatch({ type: 'ACTIVITY_ADD', payload: data })
        } else if (action === 'update') {
            // updateActivityAtoms(data.id, data, setActivities, setDebounceRef)
        } else if (action === 'delete') {
            // removeActivity(data.id, data.tripDayId, data.activityCoords)
        }
    } else if (entity === 'tripDay') {
        if (action === 'create') {
            // updateTripDayAtoms(data.id, data)
        }
    } else if (entity === 'itinerary') {
        if (action === 'update') {
            // updateItineraryAtoms(data.id, data)
        }
    }
    
}
