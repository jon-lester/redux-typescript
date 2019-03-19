import {
    IAppDataState, 
    AppDataActionTypes,
    LOAD_USER_DATA,
    SELECT_USER,
    DELETE_USER } from "./appDataTypes";

// the initial state of the app data slice for when
// the previousState is undefined (ie. at startup)

const initialState: IAppDataState = {
    selectedUser: null,
    users: []
}

// reducers for the app data slice - note that the action
// is type-checked against the union type of all possible
// action types defined in appDataTypes

export const appDataReducer = (
    previousState: IAppDataState = initialState,
    action: AppDataActionTypes) => {

        switch (action.type) {
            case LOAD_USER_DATA:
                return {
                    ...previousState,
                    users: action.users
                };
            case SELECT_USER:
                return {
                    ...previousState,
                    selectedUser: action.user
                };
            case DELETE_USER:
                return {
                    ...previousState,
                    users: previousState.users.filter(u => u.id !== action.id),
                    selectedUser: previousState.selectedUser && previousState.selectedUser.id === action.id ? null : previousState.selectedUser
                }
        }
    return previousState;
}