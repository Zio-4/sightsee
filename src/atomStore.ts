import { Itinerary, MarkerCoordinates } from './types/itinerary'
import { ActivityCoordinates } from './types/map'
import { useAtomValue, useSetAtom, useAtom, atom, PrimitiveAtom } from 'jotai'
import { TripDay, Activity } from './types/itinerary'
import { focusAtom } from 'jotai-optics'
import { splitAtom } from 'jotai/utils'

export const mapAtom = atom({})

export const searchMarkerCoordinatesAtom = atom<MarkerCoordinates>([undefined, undefined])

export const activityCoordinatesAtom = atom<ActivityCoordinates>([])

export const itineraryAtom = atom<Itinerary>({} as Itinerary)
export const tripDaysAtom = atom({}) 
export const activitiesAtom = atom({}) 

// Selector for a specific activity
export const selectActivity = (activityId: number) => atom(
    (get) => get(activitiesAtom)[activityId]
);


export function useSplitAtom(anAtom: PrimitiveAtom<any>) {
    return useAtom(splitAtom(anAtom))
}

/* if an atom is created here, use `useMemo(() => atom(initValue), [initValue])` instead. */
export function useFocusAtom(anAtom: PrimitiveAtom<any>, keyFn: (x: any) => any) {
    console.log('itinerary on focus atom call:', useAtomValue(itineraryAtom))
    return focusAtom(anAtom, keyFn)
}

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