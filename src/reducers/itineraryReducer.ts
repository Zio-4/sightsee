import { NormalizedTripData } from "../types/itinerary";


// TODO add types
export function itineraryReducer(state: NormalizedTripData, action: any) {
    switch (action.type) {
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
      case 'ACTIVITY_UPDATE': {
        return {
          ...state,
          activities: {
            ...state.activities,
            [action.payload.activityId]: {
              ...state.activities[action.payload.activityId],
              ...action.payload.data
            }
          }
        };
      }
      default:
        return state;
    }
  }
  