import { useReducer, createContext, useMemo } from 'react';
import { ItineraryContextType } from '../types/itinerary';

export function itineraryReducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_ITINERARY': {
      return action.payload
    }
  
    default:
      return state;
  }
}

export const ItineraryContext = createContext<any | null>(null);

export const ItineraryProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(itineraryReducer, {});

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};
