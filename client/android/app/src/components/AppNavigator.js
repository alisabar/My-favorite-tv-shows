import React, {Component} from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from './HomeScreen.js';
import TVShowScreen from './TVShowScreen.js';

const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        TVShow: TVShowScreen,
    },
    {
        initialRouteName: "Home"
    }

);

const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;
