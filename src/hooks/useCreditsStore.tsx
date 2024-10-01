import { create } from 'zustand';

interface CreditsStore {
    credits: number;
    setCredits: (credits: number) => void;
}

const useCreditsStore = create<CreditsStore>((set) => ({
    credits: 0,
    setCredits: (credits: number) => set({ credits }),
}));

export default useCreditsStore;
