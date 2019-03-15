import { IAppDataState, AppDataActionTypes, LOAD_USER_DATA, SELECT_USER, DELETE_USER } from "./appDataTypes";

const initialState: IAppDataState = {
    selectedUser: null,
    users: []
}

export const appDataReducer = (
    previousState: IAppDataState = initialState,
    action: AppDataActionTypes) => {

        switch (action.type) {
            case LOAD_USER_DATA:
                return {
                    ...previousState,
                    users: action.users
                }
            case SELECT_USER:
                return {
                    ...previousState,
                    selectedUser: action.user
                }
            case DELETE_USER:
                return {
                    ...previousState,
                    users: previousState.users.filter(u => u.id !== action.id)
                }
        }
    return previousState;
}