export type Itinerary = {
    coverPhoto: string
    destinations: string
    endDate: string
    id: number
    likes: number
    name: string
    creator: string
    profileId: number
    public: boolean
    startDate: string
}

export interface IInitialItineraries {
    initialItineraries: Itinerary[]
  }

  // Search card

  type ItineraryCard = {
    title: string,
    location: string,
    creator: string,
    likes: number
  }
  
export interface IItineraryCardProps {
    coverPhoto: string
    destinations: string
    endDate: string
    id: number
    likes: number
    name: string
    creator: string
    startDate: string
  }