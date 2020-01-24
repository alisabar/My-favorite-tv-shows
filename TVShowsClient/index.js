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
import rootReducer from './android/app/src/components/ReduxStore/reducers';
import { Provider } from 'react-redux'
import {createStore,applyMiddleware} from 'redux';


const store = createStore(rootReducer);
export default class MyApp extends Component {

  render() {
  console.log('in index.js');
    return(
        <View style={styles.container}><Provider store={store}><App/></Provider></View>
    );
    }
    }

AppRegistry.registerComponent(appName, () => MyApp);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' }

  })