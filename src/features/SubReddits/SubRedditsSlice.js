import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadSubReddits = createAsyncThunk(
  'subReddits/loadSubReddits',
  async () => {
    const response = await fetch('https://dummyjson.com/posts/tags');

    if (!response.ok) {
      throw new Error('Failed to load categories');
    }

    const json = await response.json();

    return json.map((tag, index) => ({
      id: index,
      display_name: tag.slug,
      name: tag.name,
    }));
  }
);

export const subRedditsSlice = createSlice({
  name: 'subReddits',

  initialState: {
    subRedditsArray: [],
    isLoading: false,
    hasError: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loadSubReddits.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadSubReddits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subRedditsArray = action.payload;
      })
      .addCase(loadSubReddits.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const selectSubReddits = (state) =>
  state.subReddits.subRedditsArray;

export const selectIsLoading = (state) =>
  state.subReddits.isLoading;

export const selectHasError = (state) =>
  state.subReddits.hasError;

export default subRedditsSlice.reducer;