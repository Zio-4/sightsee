import { atom } from 'jotai'
import { Itinerary, MarkerCoordinates } from './types/itinerary'
import { ActivityCoordinates } from './types/map'
import { useAtomValue, useSetAtom } from 'jotai'
import { TripDay, Activity } from './types/itinerary'
import { set } from 'date-fns'

export const mapAtom = atom({})

export const searchMarkerCoordinatesAtom = atom<MarkerCoordinates>([undefined, undefined])

export const activityCoordinatesAtom = atom<ActivityCoordinates>([])

export const itineraryAtom = atom<Itinerary>({} as Itinerary)


// Removes an activity from the itinerary state
export const removeActivity = (activityId: number, tripDayId: number) => {
    const itinerary = useAtomValue(itineraryAtom)
    const setItinerary = useSetAtom(itineraryAtom)
    const tripDay = itinerary.tripDays.find((tripDay: TripDay) => tripDay.id === tripDayId)
    
    if (tripDay) {
        tripDay.activities = tripDay.activities.filter((activity: Activity) => activity.id !== activityId)
    }

    setItinerary(itinerary)
}

// Adds an activity to the itinerary state
export const addActivity = (activity: Activity) => {
    const itinerary = useAtomValue(itineraryAtom)
    const setItinerary = useSetAtom(itineraryAtom)
    const tripDay = itinerary.tripDays.find((tripDay: TripDay) => tripDay.id === activity.tripDayId)

    if (tripDay) {
        tripDay.activities.push(activity)
    }

    setItinerary(itinerary)
}