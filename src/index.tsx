import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, Store } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { rootReducer, AppState, AppActionTypes } from './store';

import './index.css';

const store: Store<AppState, AppActionTypes> = createStore(
    rootReducer,
    applyMiddleware(thunk as ThunkMiddleware<AppState, AppActionTypes>)
);

ReactDOM.render(
    <Provider store={store}>
        <App companyName="Redux Test Inc" />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
