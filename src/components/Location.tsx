import * as React from 'react';

import { IGeo } from '../model/IUser';

interface ILocationProps {
    location: IGeo
}

class Location extends React.Component<ILocationProps> {
    public render() {
        return (
            <div className={'some-class'}>&nbsp;</div>
        );
    }
}

export default Location;