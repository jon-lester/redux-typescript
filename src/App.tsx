import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserList from './components/UserList';
import AppLayout from './components/AppLayout';
import SideNav from './components/SideNav';
import HeroBar from './components/HeroBar';

import getUsers from './Api';
import IUser from './model/IUser';
import { AppState } from './store';
import { loadUserData, selectUser, endLoad, deleteUser, logout, loginUser } from './store/actionCreators';

import './App.css';

interface IAppProps {
    companyName: string;
}

const dispatchMap = {
    selectUser,
    deleteUser,
    loadUserData,
    endLoad,
    logout,
    loginUser
}

class App extends Component<IAppProps & AppState & typeof dispatchMap> {

    componentDidMount() {
        getUsers().then(users => {
            this.setState({
                users,
                loaded: true
            });
            this.props.loadUserData(users);
            this.props.endLoad();
        });
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
        this.props.deleteUser(user.id);
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
