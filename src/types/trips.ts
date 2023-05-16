import { Dispatch, SetStateAction } from "react"

 // Month container 
export type Months = {
    [key: string]: string
}

export type ItineraryData = {
    coverPhoto: string | null
    destinations: string
    endDate: string
    id: number
    likes: number
    profileId: number
    public: boolean
    startDate: string
    name: string
  }

export interface IMonthContainer {
    startMonth: string
    startYear: string
    itineraries: ItineraryData[]
    selectedIndex: number
    monthContainersCheck: () => void
}

// Tab panel container
export interface ITabPanel {
    itinerariesByDate: ItinerariesMap
    selectedFilter: string
    selectedIndex: number
  }


type ItinerariesMap = {
    [key: string]: ItineraryData[]
  }


  // Trip card
export interface ITripCard {
    title: String,
    destinations: String
    startDate: Date,
    endDate: Date,
    collaborators: String[] | [],
    id: Number
    bgImage: string
}

// Trip plan form

export interface ITripsPlanForm {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
    handleInput: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void
    setCalendarDates: Dispatch<SetStateAction<Date[]>>
    calendarDates: Date[]
    submitIsDisabled: boolean
}