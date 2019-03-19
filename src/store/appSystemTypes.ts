import { Action } from "redux";

export interface IAppSystemState {
    loaded: boolean;
    userName: string | null;
}

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

export type AppSystemActionTypes =
    ILoginUserAction |
    ILogoutAction |
    IBeginLoadAction |
    IEndLoadAction;