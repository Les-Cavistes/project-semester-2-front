import { writable } from "svelte/store";
import type { TJourneysResponse } from "$lib/schemas";

interface JourneyState {
  data: TJourneysResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: JourneyState = {
  data: null,
  loading: false,
  error: null
};

const createJourneyStore = () => {
  const { subscribe, set, update } = writable<JourneyState>(initialState);

  return {
    subscribe,
    
    setJourneyData: (journeyData: TJourneysResponse) => 
      update(state => ({ ...state, data: journeyData, loading: false, error: null })),
    
    setError: (errorMessage: string) => 
      update(state => ({ ...state, error: errorMessage, loading: false })),
    
    setLoading: (isLoading: boolean) => 
      update(state => ({ ...state, loading: isLoading })),
    
    reset: () => set(initialState)
  };
};

export const journeyStore = createJourneyStore();