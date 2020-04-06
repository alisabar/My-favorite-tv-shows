/**
 * @format
 */
<script src="http://localhost:8097"></script>
import "@babel/polyfill";
import React, {Component} from 'react';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import {AppRegistry, View, StyleSheet} from 'react-native';
import {ReactDOM} from 'react-dom';
import {render} from 'react-dom'
import App from './App';
import {name as appName} from './app.json';
import rootReducer from './components/ReduxStore/reducers';
import { Provider } from 'react-redux'


const loggerMiddleware = createLogger()

const store = createStore(
                rootReducer,
                applyMiddleware(
                  thunkMiddleware, // lets us dispatch() functions
                  loggerMiddleware // neat middleware that logs actions
                )
              )


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
