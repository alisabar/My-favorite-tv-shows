import React from 'react';
import { createAppContainer, createSwitchNavigator  } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import MyRegistration from './Registration.js';
import MyLogin from './Login.js';
import FavouriteScreen from './Favourites.js';
import TVShowDetails from './TVShowDetails.js';
import HomeScreen from './HomeScreen.js';
import FavouriteShowDetails from './FavoriteShowDetails.js';

const AppNavigator = createStackNavigator(
    {
        HomeScreen: HomeScreen,
        TVShowScreen: TVShowDetails,
    },
    {
        initialRouteName: "HomeScreen"
    }

);

const MyShowsContainer = createStackNavigator(
    {
        Favorites: FavouriteScreen,
        FavouriteShow: FavouriteShowDetails,
    },
    {
        initialRouteName: "Favorites"
    }

);

const TabNavigator = createMaterialTopTabNavigator(
    {
        Login: MyLogin,
        Signup: MyRegistration,

    },

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
