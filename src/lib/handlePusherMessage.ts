import { Dispatch } from "react"
// Add functions to be passed in 
export function handlePusherMessage({msg, itineraryDispatch, tripDayDispatch, activityDispatch}: {
    msg: any,
    itineraryDispatch: Dispatch<any>,
    tripDayDispatch: Dispatch<any>,
    activityDispatch: Dispatch<any>
}) {
    const { entity, action, ...data } = msg

    if (entity === 'activity') {
        if (action === 'create') {
            activityDispatch({ type: 'ADD_ACTIVITY', payload: data })
            console.log('activity added from hook')
        } else if (action === 'update') {
            activityDispatch({ type: 'UPDATE_ACTIVITY', payload: data })
            console.log('activity updated from hook')
        } else if (action === 'delete') {
            activityDispatch({ type: 'DELETE_ACTIVITY', payload: data })
        }
    } else if (entity === 'tripDay') {
        if (action === 'create') {
            
        }
    } else if (entity === 'itinerary') {
        if (action === 'update') {
            
        }
    }
    
}
