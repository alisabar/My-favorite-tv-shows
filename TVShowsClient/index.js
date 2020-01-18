/**
 * @format
 */
import React from 'react';
//import {AppRegistry} from 'react-native';
import ReactDOM from 'react-dom';
import App from './App';
import {name as appName} from './app.json';
import rootReducer from './app/src/components/ReduxStore/reducers';
import { Provider } from 'react-redux'
import { createStore } from 'redux';


const store = createStore(rootReducer)

ReactDOM.render(
    <Provider store={store}>

        <App />

    </Provider>,
    document.getElementById('root')

);
//AppRegistry.registerComponent(appName, () => App);
