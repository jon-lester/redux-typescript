import { combineReducers } from 'redux';

import { appSystemReducer } from './appSystemReducers';
import { appDataReducer } from './appDataReducers';
import { AppDataActionTypes } from './appDataTypes';
import { AppSystemActionTypes } from './appSystemTypes';

// combines the split reducers into a single root reducer
// and exports it for use with the store
export const rootReducer = combineReducers({
    appSystem: appSystemReducer,
    appData: appDataReducer
});

// provides a type for the full state shape for
// type-safe access from container components
export type AppState = ReturnType<typeof rootReducer>;

export type AppActionTypes = AppDataActionTypes | AppSystemActionTypes;