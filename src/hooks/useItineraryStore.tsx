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
    setItinerary: (itinerary: any) => set({ itinerary }),
    setTripDays: (tripDays: any) => set({ tripDays }),
    setActivities: (activities: any) => set({ activities }),
}))

export default useItineraryStore