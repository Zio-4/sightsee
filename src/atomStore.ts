import { Itinerary, MarkerCoordinates } from './types/itinerary'
import { ActivityCoordinates } from './types/map'
import { useAtomValue, useSetAtom, useAtom, atom, PrimitiveAtom } from 'jotai'
import { TripDay, Activity, ITripDaysAtom, IActivitesAtom } from './types/itinerary'
import { focusAtom } from 'jotai-optics'
import { splitAtom } from 'jotai/utils'

export const mapAtom = atom({})

export const searchMarkerCoordinatesAtom = atom<MarkerCoordinates>([undefined, undefined])

export const activityCoordinatesAtom = atom<ActivityCoordinates>([])

export const itineraryAtom = atom<Itinerary>({} as Itinerary)
export const tripDaysAtom = atom<ITripDaysAtom>({}) 
export const activitiesAtom = atom<IActivitesAtom>({}) 

export const debouncRefAtom = atom(0)
// export function useSplitAtom(anAtom: PrimitiveAtom<any>) {
//     return useAtom(splitAtom(anAtom))
// }

// /* if an atom is created here, use `useMemo(() => atom(initValue), [initValue])` instead. */
// export function useFocusAtom(anAtom: PrimitiveAtom<any>, keyFn: (x: any) => any) {
//     console.log('itinerary on focus atom call:', useAtomValue(itineraryAtom))
//     return focusAtom(anAtom, keyFn)
// }


// These functions need to be updated since we no have seperate state for
// the three different parts of the itinerary

// Removes an activity from the activity state, the trip day state
// and activity coordinates state
export const removeActivity = (activityId: number, tripDayId: number, activityCoords: [number, number]) => {
    // const itinerary = useAtomValue(itineraryAtom)
    // const setItinerary = useSetAtom(itineraryAtom)
    // const tripDay = itinerary.tripDays.find((tripDay: TripDay) => tripDay.id === tripDayId)
    
    // if (tripDay) {
    //     tripDay.activities = tripDay.activities.filter((activity: Activity) => activity.id !== activityId)
    // }

    // setItinerary(itinerary)
}

// Adds an activity to the itinerary state
export const addActivity = (activity: Activity) => {
    // const itinerary = useAtomValue(itineraryAtom)
    // const setItinerary = useSetAtom(itineraryAtom)
    // const tripDay = itinerary.tripDays.find((tripDay: TripDay) => tripDay.id === activity.tripDayId)

    // if (tripDay) {
    //     tripDay.activities.push(activity)
    // }

    // setItinerary(itinerary)
}

export const updateActivityAtoms = (activityId: number, newData: { [key: string]: any }) => {
    const setActivities = useSetAtom(activitiesAtom)
    const setDebounceRef = useSetAtom(debouncRefAtom)
    
    setActivities((prevActivities) => ({
        ...prevActivities,
        [activityId]: { ...prevActivities[activityId], ...newData },
    }));

    setDebounceRef((prev) => prev + 1)
};