
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_ROOT = 'https://dummyjson.com';

export const loadPosts = createAsyncThunk(
  'posts/loadPosts',
  async (arg = 'popular') => {
    let endpoint;

    // Search
    if (arg.startsWith('=')) {
      const searchTerm = arg.substring(1).trim();

      endpoint = `${API_ROOT}/posts/search?q=${encodeURIComponent(
        searchTerm
      )}`;
    }

    // Category / tag
    else if (
      arg !== 'popular' &&
      arg !== 'new' &&
      arg !== 'top' &&
      arg !== 'rising'
    ) {
      endpoint = `${API_ROOT}/posts/tag/${encodeURIComponent(arg)}`;
    }

    // Main navigation
    else {
      endpoint = `${API_ROOT}/posts?limit=100`;
    }

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error('Failed to load posts');
    }

    const json = await response.json();

    let posts = [...json.posts];

    // POPULAR - most viewed
    if (arg === 'popular' || !arg) {
      posts.sort((a, b) => b.views - a.views);
    }

    // TOP - most liked
    else if (arg === 'top') {
      posts.sort(
        (a, b) =>
          (b.reactions?.likes || 0) -
          (a.reactions?.likes || 0)
      );
    }

    // NEW - newest post IDs first
    else if (arg === 'new') {
      posts.sort((a, b) => b.id - a.id);
    }

    // RISING - combination of likes and views
    else if (arg === 'rising') {
      posts.sort((a, b) => {
        const scoreA =
          (a.reactions?.likes || 0) * 2 +
          (a.views || 0);

        const scoreB =
          (b.reactions?.likes || 0) * 2 +
          (b.views || 0);

        return scoreB - scoreA;
      });
    }

    // Only display the first 30
    posts = posts.slice(0, 30);

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      selftext: post.body,
      subreddit: post.tags?.[0] || 'general',
      author: `user${post.userId}`,
      created: Date.now(),
      num_comments: post.reactions?.likes || 0,
      url: '',
      permalink: `/posts/${post.id}`,
      media_metadata: null,
      secure_media: null,
      media: null,
      url_overridden_by_dest: '',
    }));
  }
);

export const postsSlice = createSlice({
  name: 'posts',

  initialState: {
    posts: [],
    isLoading: false,
    hasError: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loadPosts.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(loadPosts.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const selectPosts = (state) => state.posts.posts;

export const selectIsLoading = (state) => state.posts.isLoading;

export const selectHasError = (state) => state.posts.hasError;

export default postsSlice.reducer;