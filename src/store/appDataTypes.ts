import IUser from "../model/IUser";

// the shape of the app data slice. this slice represents the data
// which the view displays and operates on

export interface IAppDataState {
    users: IUser[];
    selectedUser: IUser | null;
}

// action types for the app data slice

export const LOAD_USER_DATA = 'FETCH_USER_DATA';
export const SELECT_USER = 'SELECT_USER';
export const DELETE_USER = 'DELETE_USER';

// note use of typeof for the type property, allowing
// it to be type-checked against the types of the above
// as opposed to the string values

export interface ILoadUserDataAction {
    type: typeof LOAD_USER_DATA;
    users: IUser[];
}

export interface ISelectUserAction {
    type: typeof SELECT_USER;
    user: IUser;
}

export interface IDeleteUserAction {
    type: typeof DELETE_USER;
    id: number;
}

// a union of the action types supported by the app data slice,
// so that type-checking can be done in the reducer

export type AppDataActionTypes =
    ILoadUserDataAction |
    ISelectUserAction |
    IDeleteUserAction;