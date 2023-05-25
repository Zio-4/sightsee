import { atom } from 'jotai'
import { MarkerCoordinates } from './types/itinerary'
import { ActivityCoordinates } from './types/map'

export const mapAtom = atom({})

export const searchMarkerCoordinatesAtom = atom<MarkerCoordinates>([undefined, undefined])

export const activityCoordinatesAtom = atom<ActivityCoordinates>([])