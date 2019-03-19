// action-creators for all supported actions

import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

import IUser from "../model/IUser";

import { AppState, AppActionTypes } from ".";

import {
    SELECT_USER,
    CLEAR_USER_SELECTION,
    DELETE_USER,
    LOAD_USER_DATA,
    ILoadUserDataAction,
    IDeleteUserAction,
    ISelectUserAction, 
    IClearUserSelectionAction} from "./appDataTypes";

import {
    LOGIN_USER,
    LOGOUT,
    BEGIN_LOAD,
    END_LOAD,
    ILoginUserAction,
    ILogoutAction,
    IBeginLoadAction,
    IEndLoadAction } from "./appSystemTypes";

import getUsers from "../Api";

// asynchronously load user data and populate the ui with it
export const refreshUserData: ActionCreator<ThunkAction<Promise<ILoadUserDataAction>, AppState, undefined, AppActionTypes>> =
    () =>
    dispatch => {
        dispatch(beginLoad());
        return getUsers().then(users => {
            dispatch(endLoad());
            return dispatch(loadUserData(users));
        });
    }

// populate the ui with user data
export const loadUserData: ActionCreator<ILoadUserDataAction> = (users: IUser[]) => {
    return ({
        type: LOAD_USER_DATA,
        users
    });
}

// select a given user
export const selectUser: ActionCreator<ISelectUserAction> = (user: IUser) => {
    return {
        type: SELECT_USER,
        user
    };
}

// clear any user selection
export const clearUserSelection: ActionCreator<IClearUserSelectionAction> = () => {
    return {
        type: CLEAR_USER_SELECTION
    }
}

// delete a given user from state
export const deleteUser: ActionCreator<IDeleteUserAction> = (id: number) => {
    return {
        type: DELETE_USER,
        id
    };
}

// delete a given user from state, first making
// sure that the user is logged out
export const deleteUserAndVerifyLoggedOut:
    ActionCreator<ThunkAction<IDeleteUserAction, AppState, undefined, AppActionTypes>> =
    (id: number) =>
    (dispatch, getState) => {
        
        const state = getState();

        const candidateUsersWithId = state.appData.users.filter(u => u.id === id);
        let deletedUser;

        // try to locate the user with the given id
        // (this should never fail)
        if (candidateUsersWithId.length === 1) {
            deletedUser = candidateUsersWithId[0];
        }

        // if we located the user, find out if logged in
        if (deletedUser && state.appSystem.userName === deletedUser.name) {
            // if logged in, dispatch a logout
            dispatch({
                type: LOGOUT
            });
        }

        // finally, dispatch a delete for the user in all cases
        return dispatch({
            type: DELETE_USER,
            id
        });
    }

// log in a user by username (passing in the name
// as a string just to be difficult)
export const loginUser: ActionCreator<ILoginUserAction> = (userName: string) => {
    return {
        type: LOGIN_USER,
        userName
    };
}

// log out any logged-in user
export const logout: ActionCreator<ILogoutAction> = () => {
    return {
        type: LOGOUT
    };
}

// show the loading message, replacing the user grid
export const beginLoad: ActionCreator<IBeginLoadAction> = () => {
    return {
        type: BEGIN_LOAD
    }
}

// hide the loading message, allowing display of the user grid
export const endLoad: ActionCreator<IEndLoadAction> = () => {
    return {
        type: END_LOAD
    }
}
