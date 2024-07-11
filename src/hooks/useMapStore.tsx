import { set } from 'lodash';
import { create } from 'zustand';

type SearchMarkerCoordinates = [number | null, number | null]

interface MapStore {
    map: any,
    searchMarkerCoordinates: SearchMarkerCoordinates,
}

const useMapStore = create<MapStore>()((set) => ({
    map: {},
    searchMarkerCoordinates: [null, null],
    setMap: (map: any) => set({ map }),
    setSearchMarkerCoordinates: (coordinates: SearchMarkerCoordinates) => set({ searchMarkerCoordinates: coordinates }),
}));

export default useMapStore;