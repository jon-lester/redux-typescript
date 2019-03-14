import React, { Component } from 'react';
import './App.css';
import getUsers from './Api';
import UserList from './components/UserList';
import IUser from './model/IUser';
import AppLayout from './components/AppLayout';
import SideNav from './components/SideNav';
import HeroBar from './components/HeroBar';

interface IAppState {
    users: IUser[];
    selectedUser: IUser | null;
    loaded: boolean;
    userName: string | null;
}

class App extends Component<{}, IAppState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            selectedUser: null,
            users: [],
            loaded: false,
            userName: null,
        }
    }

    componentDidMount() {
        getUsers().then(users => this.setState({
            users,
            loaded: true
        }));
    }

    render() {

        const content = () => this.state.loaded ?
            <UserList
                selectedUser={this.state.selectedUser}
                users={this.state.users}
                onSelectUser={this.onSelectUser}
                onDeleteUser={this.onDeleteUser}
            /> :
            <p>Loading...</p>;

        const navigation = () => <SideNav />

        const heroBar = () => <HeroBar
            userName={this.state.userName}
            onLogin={this.onLogin}
            onLogout={this.onLogout}
        />

        return (
            <AppLayout content={content} navigation={navigation} heroBar={heroBar}/>
        );
    }

    private readonly onSelectUser = (user: IUser) => {
        this.setState({
            selectedUser: user
        });
    }

    private readonly onDeleteUser = (user: IUser) => {
        this.setState((prevState: IAppState) => ({
            users: prevState.users.filter(u => u.id !== user.id),
            selectedUser: prevState.selectedUser
                ? prevState.selectedUser.id !== user.id
                    ? prevState.selectedUser
                    : null
                : null
        }));
    }

    private readonly onLogout = () => {
        this.setState({
            userName: null
        });
    }

    private readonly onLogin = () => {
        this.setState({
            userName: this.state.selectedUser && this.state.selectedUser.name
        });
    }
}

export default App;
