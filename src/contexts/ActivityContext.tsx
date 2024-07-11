import { useReducer, createContext, useMemo } from 'react';

const activityReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'SET_ACTIVITIES': {
            return action.payload
        }
        case 'ADD_ACTIVITY': {
            return {
                ...state,
                [action.payload.id]: {
                    ...action.payload
                }
            }
        }
        case 'UPDATE_ACTIVITY': {
            return {
                ...state,
                [action.payload.id]: {
                    ...state.activities[action.payload.id],
                    ...action.payload
                }
            }
        }
        case 'DELETE_ACTIVITY': {
            const copy = { ...state };

            delete copy[action.payload.id];

            return copy;
            // update tripday as well
        } 
        default:
            return state;
    }
}

export const ActivityContext = createContext<any>(null);

export const ActivityProvider = ({ children }: React.PropsWithChildren) => {

  const [state, dispatch] = useReducer(activityReducer, {});

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};
