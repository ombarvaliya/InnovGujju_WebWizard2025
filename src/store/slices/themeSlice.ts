import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  darkMode: boolean;
}

// Check localStorage for saved theme preferences
const getSavedTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('darkMode');
    // If theme preference exists, use it
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    // Otherwise check for system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

// Apply theme to document
const applyTheme = (darkMode: boolean) => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }
};

const initialState: ThemeState = {
  darkMode: getSavedTheme(),
};

// Apply initial theme
applyTheme(initialState.darkMode);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      applyTheme(state.darkMode);
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      applyTheme(state.darkMode);
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer; 