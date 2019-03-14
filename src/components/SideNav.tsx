import * as React from 'react';

import styles from './SideNav.module.css';

interface ISideNavProps {
}

class SideNav extends React.Component<ISideNavProps> {
    public render() {
        return (
            <nav className={styles.sideNav}>
                <ul>
                    <li>Home</li>
                    <li>Users</li>
                    <li>Companies</li>
                    <li>Data</li>
                    <li>Contact</li>
                </ul>
            </nav>
        );
    }
}

export default SideNav;