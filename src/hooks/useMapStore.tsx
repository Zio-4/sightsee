import { create } from 'zustand';

type SearchMarkerCoordinates = [number | undefined, number | undefined]

interface MapStore {
    map: any,
    searchMarkerCoordinates: SearchMarkerCoordinates,
    setMap: (map: any) => void,
    setSearchMarkerCoordinates: (coordinates: SearchMarkerCoordinates) => void
}

const useMapStore = create<MapStore>()((set) => ({
    map: {},
    searchMarkerCoordinates: [undefined, undefined],
    setMap: (map: any) => set({ map }),
    setSearchMarkerCoordinates: (coordinates: SearchMarkerCoordinates) => set({ searchMarkerCoordinates: coordinates }),
}));

export default useMapStore;
