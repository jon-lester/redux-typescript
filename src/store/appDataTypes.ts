import { Action } from "redux";

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
export const CLEAR_USER_SELECTION = 'CLEAR_USER_SELECTION';
export const DELETE_USER = 'DELETE_USER';

// note use of typeof for the generic, allowing type-checking
// against the /types/ of the above as opposed to the string values

export interface ILoadUserDataAction extends Action<typeof LOAD_USER_DATA> {
    users: IUser[];
}

export interface ISelectUserAction extends Action<typeof SELECT_USER> {
    user: IUser;
}

export interface IClearUserSelectionAction extends Action<typeof CLEAR_USER_SELECTION> {
}

export interface IDeleteUserAction extends Action<typeof DELETE_USER> {
    id: number;
}

// a union of the action types supported by the app data slice,
// so that type-checking can be done in the reducer

export type AppDataActionTypes =
    ILoadUserDataAction |
    ISelectUserAction |
    IClearUserSelectionAction |
    IDeleteUserAction;