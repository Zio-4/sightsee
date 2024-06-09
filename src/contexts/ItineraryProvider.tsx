import { useReducer, createContext } from 'react';
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



  return (
    <ItineraryContext.Provider value={{ state, dispatch }}>
      {children}
    </ItineraryContext.Provider>
  );
};
