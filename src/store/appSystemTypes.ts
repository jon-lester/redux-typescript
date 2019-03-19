import { Action } from "redux";

// the shape of the app system slice. this slice represents
// 'under the hood' state

export interface IAppSystemState {
    loaded: boolean;
    userName: string | null;
}

// action types for the app system slice

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT = 'LOGOUT';
export const BEGIN_LOAD = 'BEGIN_LOAD';
export const END_LOAD = 'END_LOAD';

export interface ILoginUserAction extends Action<typeof LOGIN_USER> {
    userName: string;
}

export interface ILogoutAction extends Action<typeof LOGOUT> {
}

export interface IBeginLoadAction extends Action<typeof BEGIN_LOAD> {
}

export interface IEndLoadAction extends Action<typeof END_LOAD> {
}

// a union of the action types supported by the app system slice,
// so that type-checking can be done in the reducer

export type AppSystemActionTypes =
    ILoginUserAction |
    ILogoutAction |
    IBeginLoadAction |
    IEndLoadAction;