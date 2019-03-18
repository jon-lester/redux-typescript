import { IAppSystemState, AppSystemActionTypes, LOGIN_USER, LOGOUT, BEGIN_LOAD, END_LOAD } from "./appSystemTypes";

const initialState: IAppSystemState = {
    loaded: false,
    userName: null
}

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