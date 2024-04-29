import { Itinerary, MarkerCoordinates, NormalizedTripDay } from './types/itinerary'
import { ActivityCoordinates } from './types/map'
import { useAtomValue, useSetAtom, useAtom, atom, PrimitiveAtom } from 'jotai'
import { TripDay, Activity, ITripDaysAtom, IActivitesAtom } from './types/itinerary'
import { focusAtom } from 'jotai-optics'
import { splitAtom } from 'jotai/utils'
import { set } from 'date-fns'

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
export const addActivity = (
    activity: Activity, 
    tripDays: ITripDaysAtom, 
    setActivities: Function, 
    setDebounceRef: Function,
    setActivityCoordinates: Function
) => {
    // add activity id to tripday activity array
    // add activity to activities state
    // add activity coordinates to activity coordinates state

    const dayToUpdate = tripDays[activity.tripDayId]
    dayToUpdate!.activities.push(activity.id)

    updateActivityAtoms(activity.id, activity, setActivities, setDebounceRef)

    setActivityCoordinates((prev: ActivityCoordinates) => [...prev, [activity.longitude, activity.latitude]])
}

export const updateActivityAtoms = (
    activityId: number, 
    newData: { [key: string]: any }, 
    setActivities: Function, 
    setDebounceRef: Function
) => {    
    setActivities((prevActivities: Activity[]) => ({
        ...prevActivities,
        [activityId]: { ...prevActivities[activityId], ...newData },
    }));

    setDebounceRef((prev: number) => prev + 1)
};