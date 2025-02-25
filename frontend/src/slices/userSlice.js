import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

axios.defaults.baseURL = API_URL;
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;

const handleAxiosError = (error) => {
  
    
    if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error - Please check if server is running');
    }
    if (error.code === 'ERR_CONNECTION_REFUSED') {
        throw new Error('Unable to connect to server. Please check if the server is running.');
    }
    throw error.response?.data?.error || error.message;
    
};


export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        try {
            const response = await axios.get('/users');
            return response.data;
        } catch (error) {
            return handleAxiosError(error);
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData) => {
        try {
            let formData;
            if (userData instanceof FormData) {
                formData = userData;
            } else {
                formData = new FormData();
                Object.keys(userData).forEach(key => {
                    formData.append(key, userData[key]);
                });
            }

            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            const response = await axios.post('/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return handleAxiosError(error);
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, userData }) => {
        try {
            let formData;
            if (userData instanceof FormData) {
                formData = userData;
            } else {
                formData = new FormData();
                Object.keys(userData).forEach(key => {
                    formData.append(key, userData[key]);
                });
            }

            const response = await axios.put(`/users/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return handleAxiosError(error);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id) => {
        try {
            await axios.delete(`/users/${id}`);
            return id;
        } catch (error) {
            return handleAxiosError(error);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(createUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.unshift(action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearError, setError } = userSlice.actions;
export default userSlice.reducer;