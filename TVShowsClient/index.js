/**
 * @format
 */
<script src="http://localhost:8097"></script>
import React, {Component} from 'react';
import {AppRegistry, View, StyleSheet} from 'react-native';
import {ReactDOM} from 'react-dom';
import {render} from 'react-dom'
import App from './App';
import {name as appName} from './app.json';
import rootReducer from './components/ReduxStore/reducers';
import { Provider } from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux';


const store = createStore(combineReducers({rootReducer}));
export default class MyApp extends Component {

  render() {
  console.log('in index.js');
    return(
            <Provider store={store}>
                 <App/>
            </Provider>

    );
    }
}


AppRegistry.registerComponent(appName, () => MyApp);
