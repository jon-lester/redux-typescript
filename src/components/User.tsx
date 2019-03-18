import * as React from 'react';

import IUser from '../model/IUser';

import Company from './Company';

import classes from './User.module.css';

interface IUserProps {
    user: IUser;
    onSelectUser: (user: IUser) => void;
    onDeleteUser: (user: IUser) => void;
    selected: boolean;
}

class User extends React.Component<IUserProps> {
    public render() {
        return (
            <div
                onClick={this.selectUser(this.props.user)}
                className={this.props.selected ? classes.userContainerSelected : classes.userContainer}>
                <button onClick={this.deleteUser(this.props.user)}>X</button>
                <h4>{this.props.user.name}</h4>
                <p>{this.props.user.email}</p>
                <Company company={this.props.user.company} />
            </div>
        );
    }

    private readonly selectUser = (user: IUser) => () => {
        this.props.onSelectUser(user);
    }

    private readonly deleteUser = (user: IUser) => () => {
        this.props.onDeleteUser(user);
    }
}

export default User;