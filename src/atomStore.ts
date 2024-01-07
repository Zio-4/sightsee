import { atom } from 'jotai'
import { Itinerary, MarkerCoordinates } from './types/itinerary'
import { ActivityCoordinates } from './types/map'
import { useAtomValue } from 'jotai'
import { TripDay, Activity } from './types/itinerary'

export const mapAtom = atom({})

export const searchMarkerCoordinatesAtom = atom<MarkerCoordinates>([undefined, undefined])

export const activityCoordinatesAtom = atom<ActivityCoordinates>([])

export const itineraryAtom = atom<Itinerary>({} as Itinerary)

export const removeActivity = (activityId: number, tripDayId: number) => {
    const itinerary = useAtomValue(itineraryAtom)
    const tripDay = itinerary.tripDays.find((tripDay: TripDay) => tripDay.tripDayId === tripDayId)
    if (tripDay) {
        tripDay.activities = tripDay.activities.filter((activity: Activity) => activity.id !== activityId)
    }
    itineraryAtom.setValue(itinerary)
}