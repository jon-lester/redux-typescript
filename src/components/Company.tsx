import * as React from 'react';

import { ICompany } from '../model/IUser';

import styles from './Company.module.css';

interface ICompanyProps {
    company: ICompany
}

class Company extends React.Component<ICompanyProps> {
    public render() {
        return (
            <div className={styles.companyContainer}>
                <h5>{this.props.company.name}</h5>
                <p>{this.props.company.catchPhrase}</p>
            </div>
        );
    }
}

export default Company;