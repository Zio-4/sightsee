import { useContext } from 'react';
import { ItineraryContext } from '../contexts/ItineraryProvider';

export function useItineraryContext() {
  const context = useContext(ItineraryContext);

  if (!context) {
    throw new Error('useItineraryContext must be used within a ItineraryProvider');
  }

  return context;
}
