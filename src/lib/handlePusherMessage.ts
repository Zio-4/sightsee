
interface PusherMessage {
    entity: string,
    action: string,
    id: number,
    tripDayId: number,
}

// Add functions to be passed in 
export function handlePusherMessage({msg, addActivity, updateActivity, deleteActivity}: {
    msg: PusherMessage,
    addActivity: (activityId: number, tripDayId: number, activityData: any) => void,
    updateActivity: (activityId: number, activityData: any) => void,
    deleteActivity: (activityId: number, tripDayId: number) => void,
}) {
    const { entity, action, ...data } = msg

    if (entity === 'activity') {
        if (action === 'create') {
            addActivity(data.id, data.tripDayId, data)
            console.log('activity added from hook')
        } else if (action === 'update') {
            updateActivity(data.id, data)
            console.log('activity updated from hook')
        } else if (action === 'delete') {
            // activityDispatch({ type: 'DELETE_ACTIVITY', payload: data })
            deleteActivity(data.id, data.tripDayId)
            console.log('activity deleted from hook')
        }
    } else if (entity === 'tripDay') {
        if (action === 'create') {
            
        }
    } else if (entity === 'itinerary') {
        if (action === 'update') {
            
        }
    }
    
}
