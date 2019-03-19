import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import UserList from './components/UserList';
import AppLayout from './components/AppLayout';
import SideNav from './components/SideNav';
import HeroBar from './components/HeroBar';

import IUser from './model/IUser';

// import the redux store shape
import { AppState } from './store';

// import redux action and thunk creators
import {
    refreshUserData,
    selectUser,
    clearUserSelection,
    endLoad,
    logout,
    loginUser,
    deleteUserAndVerifyLoggedOut} from './store/actionCreators';

import './App.css';

interface IAppProps {
    companyName: string;
}

// maps component props to action-creators - passed to the connect HOC below,
// and also  used to type the component props

// TypeScript notes - it doesn't seem possible to use the simple map type (ie.
// a map containing actionReducers as opposed to a map containing dispatch
// functions as below) and have typing working correctly. Also - the last
// generic arg to ThunkDispatch /must/ be 'any' for typing to work. Maybe
// there's a better way of doing this..?

const dispatchMap = (dispatch: ThunkDispatch<AppState, any, any>) => ({
    refreshUserData: () => dispatch(refreshUserData()),
    selectUser: (user: IUser) => dispatch(selectUser(user)),
    clearUserSelection: () => dispatch(clearUserSelection()),
    endLoad: () => dispatch(endLoad()),
    logout: () => dispatch(logout()),
    loginUser: (userName: string) => dispatch(loginUser(userName)),
    deleteUserAndVerifyLoggedOut: (id: number) => dispatch(deleteUserAndVerifyLoggedOut(id))
})

// note the props-type is the union of the component's own props,
// the redux store shape, and all props defined in the dispatchMap
class App extends Component<IAppProps & AppState & ReturnType<typeof dispatchMap>> {

    componentDidMount() {

        // call the async load-data thunk on mount
        this.props.refreshUserData();
    }

    render() {
        const content = () => this.props.appSystem.loaded ?
            <UserList
                selectedUser={this.props.appData.selectedUser}
                users={this.props.appData.users}
                onClickUser={this.onClickUser}
                onDeleteUser={this.onDeleteUser}
            /> :
            <p>Loading...</p>;

        const navigation = () => <SideNav />

        const heroBar = () => <HeroBar
            companyName={this.props.companyName}
            userName={this.props.appSystem.userName}
            onLogin={this.onLogin}
            onLogout={this.onLogout}
        />

        return (
            <AppLayout content={content} navigation={navigation} heroBar={heroBar}/>
        );
    }

    private readonly onClickUser = (user: IUser) => {

        // if the user's already selected, clear the selection
        if (this.props.appData.selectedUser && this.props.appData.selectedUser.id === user.id) {
            this.props.clearUserSelection();
        } else {
            // or otherwise select the requested user
            this.props.selectUser(user);
        }
    }

    private readonly onDeleteUser = (user: IUser) => {

        // call a cross-slice thunk which deletes the user,
        // but which additionally makes sure that they're also
        // logged out
        this.props.deleteUserAndVerifyLoggedOut(user.id);
    }

    private readonly onLogout = () => {
        this.props.logout();
    }

    private readonly onLogin = () => {

        // log the selected user in, if a user is selected
        if (this.props.appData.selectedUser) {
            this.props.loginUser(this.props.appData.selectedUser.name)
        }
    }
}

// connect this component to the redux store
export default connect(

    // map state to props - redux will accept null here for
    // the same effect as below (ie. map the whole state),
    // but TypeScript wants it to be a real function
    (state: AppState) => state,

    // map dispatch functions to props, see const above class
    dispatchMap
)(App);
