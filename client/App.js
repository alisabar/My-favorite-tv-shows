<script src="http://localhost:8097"></script>
import React, {Component} from 'react';
//import {Platform, StyleSheet, Text, ActivityIndicator, Image, TextInput, View, ScrollView, TouchableHighlight , Button} from 'react-native';
//import { createStackNavigator, createAppContainer } from "react-navigation";
//import SearchComponent from './android/app/src/components/Search.js';
//import TVShowComponent from './android/app/src/components/TVshow.js';
//import HomeScreen from './android/app/src/components/HomeScreen.js';
//import TVShowScreen from './android/app/src/components/TVShowScreen.js';
import Tabs from './android/app/src/components/Tabs.js';
//import AppContainer from './android/app/src/components/AppNavigator.js';
if(__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

export default class App extends React.Component {
  render() {
    return <Tabs/>;
  }
}

