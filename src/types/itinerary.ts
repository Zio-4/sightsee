import { Dispatch, SetStateAction } from "react"
// Itinerary

export type Activity = {
    city: string
    contactInfo: string
    country: string
    endTime: string
    id: number
    name: string
    note: string
    photo: string | null
    postalCode: string
    startTime: string
    street: string
    tripDayId: number
}
type TripDay = {
    activities: Activity[] | []
    date: Date
    id: number
    itineraryId: number
}

export type Itinerary = {
    coverPhoto: string | null
    destinations: string
    endDate: Date
    id: number
    likes: number
    name: string
    public: boolean
    profileId: number
    startDate: Date
    tripDays: TripDay[]
    creator: string
  }

export interface IItineraryData {
    itin: Itinerary
}

// TripDay

export interface ITripDay {
    date: Date
    activities: Activity[] | [],
    tripDayId: number,
}

// Activity form

export interface IActivityForm {
    setActivitiesState: Dispatch<SetStateAction<Activity[]>>,
    tripDayId: number,
}

// Activity
export interface IActivityProps {
    setReadOnly: Dispatch<SetStateAction<boolean>>
    deleteActivity: (activityId: number) => Promise<void>
    readOnly: boolean
    city: string
    contactInfo: string
    country: string
    endTime: string
    id: number
    name: string
    note: string
    photo: string | null
    postalCode: string
    startTime: string
    street: string
    tripDayId: number
}

// itinerary/[id] PAGE

export type MarkerCoordinates = [number | undefined, number | undefined]