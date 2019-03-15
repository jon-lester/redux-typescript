import { SELECT_USER, DELETE_USER, LOAD_USER_DATA } from "./appDataTypes";
import { LOGIN_USER, LOGOUT, BEGIN_LOAD, END_LOAD } from "./appSystemTypes";

export const fetchUserData = () => {
    return {
        type: LOAD_USER_DATA
    };
}

export const selectUser = (id: number) => {
    return {
        type: SELECT_USER,
        id
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
