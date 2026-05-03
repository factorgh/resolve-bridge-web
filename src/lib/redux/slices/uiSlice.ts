import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  onboardingStep: string;
}

const initialState: UiState = {
  isSidebarOpen: false,
  theme: 'light',
  onboardingStep: 'goals',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setOnboardingStep: (state, action: PayloadAction<string>) => {
      state.onboardingStep = action.payload;
    },
  },
});

export const { toggleSidebar, setTheme, setOnboardingStep } = uiSlice.actions;
export default uiSlice.reducer;
