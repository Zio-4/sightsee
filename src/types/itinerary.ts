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
    latitude: number
    longitude: number
    tripDayId: number
}

export interface IActivitesAtom {
    [key: string]: Activity
}

export type TripDay = {
    // activities: Activity[] | number[]
    activities: number[]
    date: Date
    id: number
    itineraryId: number
}

export interface ITripDaysAtom {
    [key: string]: TripDay
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
    tripDays: TripDay[] | number[]
    creator: string
}

export interface IItineraryData {
    itin: Itinerary
}

// TripDay

// export interface ITripDay {
//     date: Date
//     activities: Activity[] | [],
//     tripDayId: number,
// }

// Activity form

export interface IActivityForm {
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
    itinerary: Itinerary,
    tripDays: TripDay[],
    activities: Activity[],
    activityCoordinates: ActivityCoordinates
}