import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Space, Location } from '../types/space';

interface SpaceState {
  spaces: Space[];
  locations: Location[];
  addSpace: (space: Space) => void;
  addLocation: (location: Location) => void;
  removeSpace: (id: string) => void;
  removeLocation: (id: string) => void;
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set) => ({
      spaces: [],
      locations: [],
      addSpace: (space) => set((state) => ({ spaces: [...state.spaces, space] })),
      addLocation: (location) => set((state) => ({ locations: [...state.locations, location] })),
      removeSpace: (id) => set((state) => ({
        spaces: state.spaces.filter((s) => s.id !== id),
        locations: state.locations.filter((l) => l.spaceId !== id),
      })),
      removeLocation: (id) => set((state) => ({
        locations: state.locations.filter((l) => l.id !== id),
      })),
    }),
    {
      name: 'space-storage',
    }
  )
);
