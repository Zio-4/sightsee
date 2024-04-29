import { set } from 'date-fns'
import { 
    updateActivityAtoms,
    addActivity,
    removeActivity
 } from '../atomStore'

// Add functions to be passed in 
export function handlePusherMessage(msg: any) {
    const { entity, action, ...data } = msg

    if (entity === 'activity') {
        if (action === 'create') {
            addActivity(data, )
        } else if (action === 'update') {
            updateActivityAtoms(data.id, data, setActivities, setDebounceRef)
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