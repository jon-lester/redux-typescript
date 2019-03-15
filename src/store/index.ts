import { combineReducers } from 'redux';
import { appSystemReducer } from './appSystemReducers';
import { appDataReducer } from './appDataReducers';

export const rootReducer = combineReducers({
    appSystem: appSystemReducer,
    appData: appDataReducer
});

export type AppState = ReturnType<typeof rootReducer>;