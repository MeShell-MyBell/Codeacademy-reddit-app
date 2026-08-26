import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_ROOT = 'https://dummyjson.com';

export const loadComments = createAsyncThunk(
  'comments/loadComments',
  async (permalink) => {
    const postId = permalink.split('/').filter(Boolean).pop();

    const response = await fetch(`${API_ROOT}/posts/${postId}/comments`);

    if (!response.ok) {
      throw new Error('Failed to load comments');
    }

    const json = await response.json();

    return json.comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      author: comment.user?.username || 'anonymous',
      score: comment.likes || 0,
      created: Date.now(),
    }));
  }
);

export const commentsSlice = createSlice({
  name: 'comments',

  initialState: {
    commentsArray: [],
    isLoading: false,
    hasError: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loadComments.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commentsArray = action.payload;
      })
      .addCase(loadComments.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const selectComments = (state) => state.comments.commentsArray;

export const selectIsLoading = (state) => state.comments.isLoading;

export const selectHasError = (state) => state.comments.hasError;

export default commentsSlice.reducer;