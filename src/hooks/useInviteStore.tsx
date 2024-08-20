import { create } from 'zustand';

interface InviteStore {
    errorMessage: string,
    setErrorMessage: (errorMessage: string) => void,
    joinedTrip: boolean,
    setJoinedTrip: (joinedTrip: boolean) => void,
}

const useInviteStore = create<InviteStore>()((set) => ({
    errorMessage: '',
    setErrorMessage: (errorMessage: string) => set({ errorMessage }),
    joinedTrip: false,
    setJoinedTrip: (joinedTrip: boolean) => set({ joinedTrip }),
}));

export default useInviteStore;