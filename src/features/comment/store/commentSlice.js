import { createSlice } from '@reduxjs/toolkit';
import {
  fetchComments,
  addComment,
  addReply,
  updateComment,
  deleteComment,
  countComments,
  toggleLikeComment
} from '../services/comment.js';

const initialState = {
  comments: [],
  commentCount: 0,
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch comments
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add comment
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.loading = false;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add reply
    builder
      .addCase(addReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReply.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment.id === action.payload.parentId);
        if (index >= 0) {
          state.comments[index].replies.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(addReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update comment
    builder
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment.id === action.payload.id);
        if (index >= 0) {
          state.comments[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete comment
    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Count comments
    builder
      .addCase(countComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(countComments.fulfilled, (state, action) => {
        state.commentCount = action.payload;
        state.loading = false;
      })
      .addCase(countComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Toggle like comment
    builder
      .addCase(toggleLikeComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment.id === action.payload.id);
        if (index >= 0) {
          state.comments[index].isLiked = action.payload.isLiked;
        }
        state.loading = false;
      })
      .addCase(toggleLikeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
