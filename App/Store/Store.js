import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from '../Reducer';


const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck:false
        }).concat(logger)
});
//.concat(logger)
export default store;