import { useContext, useMemo } from 'react';
import { ItineraryContext } from '../contexts/ItineraryProvider';
import { useItineraryContext } from './useItineraryContext';

export const useItinerarySelector = (selector: any) => {
  const { state } = useItineraryContext();
  return useMemo(() => selector(state), [state, selector]);
};