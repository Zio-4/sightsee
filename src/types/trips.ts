import { Dispatch, SetStateAction } from "react"
import { Itinerary } from "./itinerary"
import { B } from "vitest/dist/types-94cfe4b4"

 // Month container 
export type Months = {
    [key: string]: string
}


export interface IMonthContainer {
    startMonth: string
    startYear: string
    itineraries: Itinerary[]
    selectedIndex: number
    monthContainersCheck: () => void
}

// Tab panel container
export interface ITabPanel {
    itinerariesByDate: ItinerariesMap
    selectedFilter: string
    selectedIndex: number
  }


export type ItinerariesMap = {
    [key: string]: Itinerary[]
  }


  // Trip card
export interface ITripCard {
    title: String,
    destinations: String
    startDate: Date,
    endDate: Date,
    collaborators: String[] | [],
    collaborator?: Boolean,
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

// trips/index

export interface IItineraryList {
  itineraries: Itinerary[]
}

type itinMap = {
  [key: string]: Itinerary[]
}
export interface IMappedItineraries {
  itineraryData: itinMap
}

export interface INoData {
  noItins: boolean
}
