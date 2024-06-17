import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  status: 'idle',
  error: null,
};

export const sendEmail = createAsyncThunk(
  'email/sendEmail',
  async ({ email, roomid, propertyId }, thunkAPI) => {
    try {
      const response = await fetch('https://team14-ibe-kdu24.azurewebsites.net/sendemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, roomid, propertyId }),
      });
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      return 'Email sent successfully!';
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendEmail.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

export const { } = emailSlice.actions;
export default emailSlice.reducer;