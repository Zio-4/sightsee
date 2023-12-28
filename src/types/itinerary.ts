import { Dispatch, SetStateAction } from "react"
import { ActivityCoordinates } from "./map"
// Itinerary

export type Activity = {
    contactInfo: string
    endTime: string
    id: number
    name: string
    note: string
    photo: string | null
    startTime: string
    address: string
    latitude: number | undefined
    longitude: number | undefined
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
    deleteActivity: (activityId: number, activityCoordinates: [number | undefined, number | undefined]) => Promise<void>
    readOnly: boolean
    address: string
    contactInfo: string
    endTime: string
    id: number
    name: string
    note: string
    photo: string | null
    startTime: string
    latitude: number | undefined
    longitude: number | undefined
    tripDayId: number
}

// itinerary/[id] PAGE

export type MarkerCoordinates = [number | undefined, number | undefined]


// trips/[id]

export interface IItineraryPage {
    itin: Itinerary
    activityCoordinates: ActivityCoordinates
}