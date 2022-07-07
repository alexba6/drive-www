import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk';
import {driveStore} from "./Drive/DriveReducer";

export const store = configureStore({
    reducer: {
        drive: driveStore.reducer
    },
    middleware: [thunkMiddleware]
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
