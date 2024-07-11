import { useReducer, createContext, useMemo } from 'react';

const mapReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'SET_MAP': {
            return action.payload
        }
        default:
            return state;
    }
}

export const MapContext = createContext<any>(null);

export const MapProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(mapReducer, {});

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};