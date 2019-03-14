import * as React from 'react';

import styles from  './AppLayout.module.css';

interface IAppLayoutProps {
    navigation: () => React.ReactElement;
    content: () => React.ReactElement;
    heroBar: () => React.ReactElement;
}

class AppLayout extends React.Component<IAppLayoutProps> {
    public render() {
        return (
            <div className={styles.appLayoutFrame}>
                <div className={styles.appLayoutHeroBar}>
                    {this.props.heroBar()}
                </div>
                <div className={styles.appLayoutContentArea}>
                    <div className={styles.appLayoutSidebar}>
                        {this.props.navigation()}
                    </div>
                    <div className={styles.appLayoutContent}>
                        {this.props.content()}
                    </div>
                </div>
            </div>
        );
    }
}

export default AppLayout;