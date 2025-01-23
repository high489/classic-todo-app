import { StateCreator } from 'zustand'

export interface FilterSlice {
  filterOption: 'all' | 'active' | 'completed';
  setFilterOption: (option: 'all' | 'active' | 'completed') => void;
}

export const createFilterSlice: StateCreator<FilterSlice> = (set) => ({
  filterOption: 'all',
  setFilterOption: (option) => set({ filterOption: option })
})