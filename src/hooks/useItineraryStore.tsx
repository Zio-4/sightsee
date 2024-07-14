import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer'

interface ItineraryStore {
    itinerary: any
    tripDays: any
    activities: any
    setItinerary: (itinerary: any) => void
    setTripDays: (tripDays: any) => void,
    addTripDay: (tripDayId: number, tripDay: any) => void,
    updateTripDay: (tripDayId: number, tripDayData: any) => void,
    setActivities: (activities: any) => void,
    addActivity: (activityId: number, tripDayId: number, activityData: any) => void,
    updateActivity: (activityId: number, activityData: any) => void,
    deleteActivity: (activityId: number, tripDayId: number) => void,
}

const useItineraryStore = create<ItineraryStore>()(
    immer((set) => ({
        itinerary: {},
        tripDays: {},
        activities: {},
        setItinerary: (itinerary: any) => set({ itinerary }),
        setTripDays: (tripDays: any) => set({ tripDays }),
        addTripDay: (tripDayId: number, tripDay: any) => set((state: any) => {
            state.itinerary.tripDays.push(tripDayId)
            state.tripDayId = { ...tripDay }
            return state
        }),
        updateTripDay: (tripDayId: number, tripDayData: any) => set((state: any) => { state.tripDayId = { ...state[tripDayId], ...tripDayData } }),
        setActivities: (activities: any) => set({ activities }),
        addActivity: (activityId: number, tripDayId: number, activityData: any) => set((state: any) => {
            state.tripDays[tripDayId].activities.push(activityId)
            state.activities[activityId] = { ...activityData }
            return state
        }),
        updateActivity: (activityId: number, activityData: any) => set((state: any) => { state.activities[activityId] = { ...state.activities[activityId], ...activityData } }),
        deleteActivity: (activityId: number, tripDayId: number) => set((state: any) => {
            state.tripDays[tripDayId].activities = state.tripDays[tripDayId].activities.filter((id: number) => id !== activityId)
            delete state.activities[activityId] 
            return state
        }),
    })),
)


export default useItineraryStore