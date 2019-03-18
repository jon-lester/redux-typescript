import * as React from 'react';

import IUser from '../model/IUser';
import User from './User';

interface IUserListProps {
    users: IUser[];
    selectedUser: null | IUser;
    onSelectUser: (user: IUser) => void;
    onDeleteUser: (user: IUser) => void;
}

import styles from './UserList.module.css';

class UserList extends React.Component<IUserListProps> {
    public render() {

        const userComponents = this.props.users.map(u => <User
            key={u.id}
            user={u}
            onSelectUser={this.props.onSelectUser}
            onDeleteUser={this.props.onDeleteUser}
            selected={!!this.props.selectedUser && this.props.selectedUser.id === u.id}
        />);

        return (
            <div className={styles.userListContainer}>
                {userComponents}
            </div>
        );
    }
}

export default UserList;