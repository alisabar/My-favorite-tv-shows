/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, StyleSheet,Text} from 'react-native';
import LoginStackNavigator from './components/Tabs';


function App() {
console.log('in app.js');
  return (
    <LoginStackNavigator/>
  );
};



export default App;
