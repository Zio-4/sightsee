import { atom } from 'jotai'
import { MarkerCoordinates } from './types/itinerary'

export const mapAtom = atom({})

export const searchMarkerCoordinatesAtom = atom<MarkerCoordinates>([undefined, undefined])