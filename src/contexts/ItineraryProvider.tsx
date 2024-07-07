import { useReducer, createContext, useMemo } from 'react';
import { itineraryReducer } from '../reducers/itineraryReducer';
import { ItineraryContextType } from '../types/itinerary';

export const ItineraryContext = createContext<ItineraryContextType | null>(null);

export const ItineraryProvider = ({ children }: React.PropsWithChildren) => {
  const initialState = {
    itinerary: { }, 
    tripDays: { },
    activities: { },
    searchMarkerCoordinates: [undefined, undefined],
    map: {}
  };

  const [state, dispatch] = useReducer(itineraryReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};
