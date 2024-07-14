import { create } from 'zustand';

interface ItineraryStore {
    itinerary: any
    tripDays: any
    activities: any
    setItinerary: (itinerary: any) => void
    setTripDays: (tripDays: any) => void
    setActivities: (activities: any) => void
}

const useItineraryStore = create<ItineraryStore>()((set) => ({
    itinerary: {},
    tripDays: {},
    activities: {},
    setItinerary: (itinerary: any) => set(itinerary),
    setTripDays: (tripDays: any) => set(tripDays ),
    addTripDay: (tripDayId: number, tripDay: any) => set((state: any) => ({ ...state, [tripDayId]: { ...tripDay } })),
    updateTripDay: (tripDayId: number, tripDay: any) => set((state: any) => ({ ...state, [tripDayId]: { ...state[tripDayId], ...tripDay } })),
    setActivities: (activities: any) => set(activities),
}))

export default useItineraryStore


// case 'ADD_TRIP_DAY': {
//     return {
//         ...state,
//         [action.payload.id]: {
//             ...action.payload
//         }
//     }
// }
// case 'UPDATE_TRIP_DAY': {
//     return {
//         ...state,
//         [action.payload.id]: {
//             ...state[action.payload.id],
//             ...action.payload
//         }
//     }
// }