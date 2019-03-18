export interface IAppSystemState {
    loaded: boolean;
    userName: string | null;
}

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT = 'LOGOUT';
export const BEGIN_LOAD = 'BEGIN_LOAD';
export const END_LOAD = 'END_LOAD';

export interface ILoginUserAction {
    type: typeof LOGIN_USER;
    userName: string;
}

export interface ILogoutAction {
    type: typeof LOGOUT;
}

export interface IBeginLoadAction {
    type: typeof BEGIN_LOAD;
}

export interface IEndLoadAction {
    type: typeof END_LOAD;
}

export type AppSystemActionTypes =
    ILoginUserAction |
    ILogoutAction |
    IBeginLoadAction |
    IEndLoadAction;