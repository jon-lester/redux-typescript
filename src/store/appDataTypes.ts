import IUser from "../model/IUser";

export interface IAppDataState {
    users: IUser[];
    selectedUser: IUser | null;
}

export const LOAD_USER_DATA = 'FETCH_USER_DATA';
export const SELECT_USER = 'SELECT_USER';
export const DELETE_USER = 'DELETE_USER';

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

export type AppDataActionTypes =
    ILoadUserDataAction |
    ISelectUserAction |
    IDeleteUserAction;