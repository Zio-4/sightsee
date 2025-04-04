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

export interface Activities {
    [key: string]: Activity
}

export type NormalizedTripDay = {
    activities: number[]
    date: Date
    id: number
    itineraryId: number
}

export type TripDay = {
    id: number;
    date: Date;
    destinationId: number;
    activities: number[];
    // ... other properties
}

export interface TripDays {
    [key: string]: NormalizedTripDay
}

export interface Itinerary {
    coverPhoto: string | null
    destinations: string
    endDate: Date
    id: number
    likes: number
    name: string
    public: boolean
    profileId: number
    startDate: Date
    tripDays: number[]
    creator: string
    collaborationId: number
}

type ItineraryAction = {
    type: string
    payload: any
}


export interface ItineraryContextType {
    state: NormalizedTripData
    dispatch: Dispatch<ItineraryAction>
}

export interface NormalizedTripData {
    itinerary: Itinerary
    tripDays: TripDays
    activities: Activities
    searchMarkerCoordinates: [number | undefined, number | undefined],
    map: any
}

export interface IItineraryData {
    itin: Itinerary
}


// Activity form

export interface IActivityForm {
    tripDayId: number,
    destination: string,
    destinationId: number
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
    tripDays: TripDays,
    activities: Activities,
    activityCoordinates: ActivityCoordinates
}
