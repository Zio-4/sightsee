import { useReducer, createContext, useMemo } from 'react';

const tripDayReducer = (state: any, action: any) => {    
    switch (action.type) {
        case 'SET_TRIP_DAYS': {
            return action.payload
        }
        case 'ADD_TRIP_DAY': {
            return {
                ...state,
                [action.payload.id]: {
                    ...action.payload
                }
            }
        }
        case 'UPDATE_TRIP_DAY': {
            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    ...action.payload
                }
            }
        }
        // case 'DELETE_TRIP_DAY': {
        //     const { tripDayId } = action.payload;

        //     // Copy tripDays and remove the specific trip day
        //     const tripDaysCopy = { ...state.tripDays };
        //     if (tripDaysCopy[tripDayId]) {
        //         // @ts-ignore
        //         tripDaysCopy[tripDayId] = {
        //             ...tripDaysCopy[tripDayId],
        //             activities: tripDaysCopy[tripDayId]!.activities.filter(id => id !== action.payload.activityId)
        //         };
        //     }

        //     return {
        //         ...state,
        //         tripDays: tripDaysCopy
        //     };
        // }
        case 'ADD_ACTIVITY': {
            return {
                ...state,
                [action.payload.tripDayId]: {
                    ...state[action.payload.tripDayId],
                    activities: [
                        ...state[action.payload.tripDayId].activities,
                        action.payload.activityId
                    ]
                }
            }
        }
        default:
            return state;
    }
}

export const TripDayContext = createContext<any>(null);

export const TripDayProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(tripDayReducer, {});

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <TripDayContext.Provider value={value}>
      {children}
    </TripDayContext.Provider>
  );
};
