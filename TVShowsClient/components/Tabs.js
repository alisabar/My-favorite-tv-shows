import React from 'react';
import { createAppContainer, createSwitchNavigator  } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import MyRegistration from './RegistrationScreen.js';
import MyLogin from './LoginScreen.js';
import FavouriteScreen from './Favourites.js';
import TVShowScreen from './TVShowScreen.js';
import HomeScreen from './HomeScreen.js';
import FavouriteShowScreen from './FavouriteShowScreen.js';

const AppNavigator = createStackNavigator(
    {
        HomeScreen: HomeScreen,
        TVShowScreen: TVShowScreen,
    },
    {
        initialRouteName: "HomeScreen"
    }

);

const MyShowsContainer = createStackNavigator(
    {
        Favorites: FavouriteScreen,
        FavouriteShow: FavouriteShowScreen,
    },
    {
        initialRouteName: "Favorites"
    }

);

const TabNavigator = createMaterialTopTabNavigator(
    {
        Signup: MyRegistration,
        Login: MyLogin,
    },

    {
        initialRouteName: "Login"
    }

);

const LoggedInNavigator = createMaterialTopTabNavigator(
    {
        Home: AppNavigator,
        MyShows: MyShowsContainer,
    },
    {
        initialRouteName: "Home"
    }


);

const LoginStackNavigator = createSwitchNavigator(
    {
        Tab: TabNavigator,
        MyFavourites: LoggedInNavigator,
    },
    {
        initialRouteName: "Tab"
    }

);

export default createAppContainer(LoginStackNavigator);
