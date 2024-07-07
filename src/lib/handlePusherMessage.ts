import { Dispatch } from "react"
// Add functions to be passed in 
export function handlePusherMessage(msg: any, dispatch: Dispatch<any>) {
    const { entity, action, ...data } = msg

    if (entity === 'activity') {
        if (action === 'create') {
            dispatch({ type: 'ACTIVITY_ADD', payload: data })
            console.log('activity added from hook')
        } else if (action === 'update') {
            dispatch({ type: 'ACTIVITY_UPDATE', payload: data })
            console.log('activity updated from hook')
        } else if (action === 'delete') {
            dispatch({ type: 'ACTIVITY_DELETE', payload: data })
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
