import { act } from "react-dom/test-utils";
import { NormalizedTripData } from "../types/itinerary";


// TODO add types
export function itineraryReducer(state: NormalizedTripData, action: any) {
  switch (action.type) {
    // Sets itinerary, tripDays, activities,
    case 'SET_ITINERARY': {
      return {
        ...state,
        ...action.payload
      };
    }
    // case 'UPDATE_ITINERARY': {
    //   return {
    //     ...state,
    //     itinerary: {
    //       ...state.itinerary,
    //       ...action.payload.data
    //     }
    //   };
    // }
    case 'SET_MAP': {
      return {
        ...state,
        map: action.payload
      };
    }
    case 'SET_SEARCH_MARKER_COORDINATES': {
      return {
        ...state,
        searchMarkerCoordinates: action.payload
      };
    }
    case 'UPDATE_SEARCH_MARKER_COORDINATES': {
      return {
        ...state,
        searchMarkerCoordinates: {
          ...state.searchMarkerCoordinates,
          ...action.payload
        }
      };
    }
    // TRIPDAY
    case 'ITINERARY_UPDATE': {
      return {
        ...state,
        itinerary: {
          ...state.itinerary,
          ...action.payload.data
        }
      };
    }
    // Check
    case 'TRIPDAY_ADD': {
      return {
        ...state,
        tripDays: {
          ...state.tripDays,
          [action.payload.tripDayId]: {
            ...action.payload.data
          }
        }
      };
    }
    case 'TRIPDAY_UPDATE': {
      return {
        ...state,
        tripDays: {
          ...state.tripDays,
          [action.payload.tripDayId]: {
            ...state.tripDays[action.payload.tripDayId],
            ...action.payload.data
          }
        }
      };
    }
    // Check
    case 'TRIPDAY_DELETE': {
      return {
        ...state,
        tripDays: {
          ...state.tripDays,
          [action.payload.tripDayId]: undefined
        }
      };
    }
    // ACTIVITY
    case 'ACTIVITY_ADD': {
      return {
        ...state,
        tripDays: {
          ...state.tripDays,
          [action.payload.tripDayId]: {
            ...state.tripDays[action.payload.tripDayId],
            activities: [
              ...state.tripDays[action.payload.tripDayId]!.activities,
              action.payload.id
            ]
          }
        },
        activities: {
          ...state.activities,
          [action.payload.id]: {
            ...action.payload
          }
        }
      };
    }
    case 'ACTIVITY_UPDATE': {
      return {
        ...state,
        activities: {
          ...state.activities,
          [action.payload.activityId]: {
            ...state.activities[action.payload.activityId],
            ...action.payload
          }
        }
      };
    }
    case 'ACTIVITY_DELETE': {  
      const { activityId, tripDayId } = action.payload;
  
      // Copy activities and remove the specific activity
      const activitiesCopy = { ...state.activities };
      delete activitiesCopy[activityId];
  
      // Copy tripDays and remove the activity from the specific trip day
      const tripDaysCopy = { ...state.tripDays };
      if (tripDaysCopy[tripDayId]) {
        // @ts-ignore
          tripDaysCopy[tripDayId] = {
              ...tripDaysCopy[tripDayId],
              activities: tripDaysCopy[tripDayId]!.activities.filter(id => id !== activityId)
          };
      }
  
      return {
          ...state,
          tripDays: tripDaysCopy,
          activities: activitiesCopy
      };
  }
    default:
      return state;
  }
}
  