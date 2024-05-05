import { useReducer, createContext } from 'react';
import { itineraryReducer } from '../reducers/itineraryReducer';

const ItineraryContext = createContext({});

export const ItineraryProvider = ({ children }: React.PropsWithChildren) => {
  const initialState = {
    itineraries: { },
    tripDays: { },
    activities: { }
  };

  const [state, dispatch] = useReducer(itineraryReducer, initialState);

  return (
    <ItineraryContext.Provider value={{ state, dispatch }}>
      {children}
    </ItineraryContext.Provider>
  );
};
