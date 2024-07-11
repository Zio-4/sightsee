import { useReducer, createContext, useMemo } from 'react';

const searchMarkerReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'UPDATE_SEARCH_MARKER_COORDINATES': {
            return [
                ...state,
                action.payload
            ]
        }
        default:
            return state;
    }
}

export const SearchMarkerContext = createContext<any>(null);

export const SearchMarkerProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(searchMarkerReducer, [null, null]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <SearchMarkerContext.Provider value={value}>
      {children}
    </SearchMarkerContext.Provider>
  );
};
