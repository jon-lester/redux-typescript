import * as React from 'react';

import styles from './HeroBar.module.css';

interface IHeroBarProps {
    onLogin: () => void;
    onLogout: () => void;
    userName: string | null;
    companyName: string;
}

class HeroBar extends React.Component<IHeroBarProps> {
    public render() {
        return (
            <div className={styles.heroBar}>
                <div className={styles.heroBarTextContent}>
                    <span className={styles.heroBarTitle}>
                        {this.props.companyName}
                    </span>
                    <span className={styles.heroBarSubtitle}>
                        {this.props.userName ? `Logged in as ${this.props.userName}` : 'Logged out'}
                    </span>
                </div>
                <div className={styles.heroBarButtons}>
                    <button onClick={this.handleLoginClick}>LOG IN</button>
                    <button onClick={this.handleLogoutClick}>LOG OUT</button>
                </div>
            </div>
        );
    }

    private readonly handleLoginClick = () => {
        this.props.onLogin();
    }

    private readonly handleLogoutClick = () => {
        this.props.onLogout();
    }
}

export default HeroBar;