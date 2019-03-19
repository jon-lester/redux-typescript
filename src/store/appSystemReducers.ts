import {
    IAppSystemState,
    AppSystemActionTypes,
    LOGIN_USER,
    LOGOUT,
    BEGIN_LOAD,
    END_LOAD } from "./appSystemTypes";

// the initial state of the system data slice for when
// the previousState is undefined (ie. at startup)

const initialState: IAppSystemState = {
    loaded: false,
    userName: null
}

// reducers for the system data slice - note that the action
// is type-checked against the union type of all possible
// action types defined in appSystemTypes

export const appSystemReducer = (
    previousState: IAppSystemState = initialState,
    action: AppSystemActionTypes) => {

    switch (action.type) {
        case LOGIN_USER:
            return {
                ...previousState,
                userName: action.userName
            }
        case LOGOUT:
            return {
                ...previousState,
                userName: null
            }
        case BEGIN_LOAD:
            return {
                ...previousState,
                loaded: false
            }
        case END_LOAD:
            return {
                ...previousState,
                loaded: true
            }
    }

    return previousState;
}