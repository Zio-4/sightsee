import { Dispatch, SetStateAction } from "react"
// Itinerary

type IActivity = {
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
    activities: IActivity[] | []
    date: Date
    id: number
    itineraryId: number
}

export interface IItineraryData {
    itin: {
        coverPhoto?: string
        destinations: string
        endDate: Date
        id: number
        likes: number
        name: string
        public: boolean
        profileId: string
        startDate: Date
        tripDays: TripDay[]
    }
}

// TripDay

export interface ITripDay {
    date: Date
    activities: IActivity[] | [],
    tripDayId: number,
}

// Activity form

export interface IActivityForm {
    setActivitiesState: Dispatch<SetStateAction<IActivity[]>>,
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