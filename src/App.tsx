import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import UserList from './components/UserList';
import AppLayout from './components/AppLayout';
import SideNav from './components/SideNav';
import HeroBar from './components/HeroBar';

import IUser from './model/IUser';

import { AppState } from './store';
import {
    refreshUserData,
    selectUser,
    endLoad,
    logout,
    loginUser,
    deleteUserAndVerifyLoggedOut } from './store/actionCreators';

import './App.css';

interface IAppProps {
    companyName: string;
}

const dispatchMap = (dispatch: ThunkDispatch<AppState, any, any>) => ({
    refreshUserData: () => dispatch(refreshUserData()),
    selectUser: (user: IUser) => dispatch(selectUser(user)),
    endLoad: () => dispatch(endLoad()),
    logout: () => dispatch(logout()),
    loginUser: (userName: string) => dispatch(loginUser(userName)),
    deleteUserAndVerifyLoggedOut: (id: number) => dispatch(deleteUserAndVerifyLoggedOut(id))
})

class App extends Component<IAppProps & AppState & ReturnType<typeof dispatchMap>> {

    componentDidMount() {
        this.props.refreshUserData();
    }

    render() {
        const content = () => this.props.appSystem.loaded ?
            <UserList
                selectedUser={this.props.appData.selectedUser}
                users={this.props.appData.users}
                onSelectUser={this.onSelectUser}
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

    private readonly onSelectUser = (user: IUser) => {
        this.props.selectUser(user);
    }

    private readonly onDeleteUser = (user: IUser) => {
        this.props.deleteUserAndVerifyLoggedOut(user.id);
    }

    private readonly onLogout = () => {
        this.props.logout();
    }

    private readonly onLogin = () => {
        this.props.loginUser(this.props.appData.selectedUser ? this.props.appData.selectedUser.name : '[No user selected]');
    }
}

export default connect(
    // mapStateToProps
    (state: AppState) => state,
    // mapDispatchToProps
    dispatchMap
)(App);
