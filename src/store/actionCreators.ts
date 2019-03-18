// action-creators for all supported actions

import IUser from "../model/IUser";

import { SELECT_USER, DELETE_USER, LOAD_USER_DATA } from "./appDataTypes";
import { LOGIN_USER, LOGOUT, BEGIN_LOAD, END_LOAD } from "./appSystemTypes";

export const loadUserData = (users: IUser[]) => {
    return {
        type: LOAD_USER_DATA,
        users
    };
}

export const selectUser = (user: IUser) => {
    return {
        type: SELECT_USER,
        user
    };
}

export const deleteUser = (id: number) => {
    return {
        type: DELETE_USER,
        id
    };
}

export const loginUser = (userName: string) => {
    return {
        type: LOGIN_USER,
        userName
    };
}

export const logout = () => {
    return {
        type: LOGOUT
    };
}

export const beginLoad = () => {
    return {
        type: BEGIN_LOAD
    }
}

export const endLoad = () => {
    return {
        type: END_LOAD
    }
}
