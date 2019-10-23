import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import MyRegistration from './RegistrationScreen.js';
import MyLogin from './LoginScreen.js';
//import AppContainer from './AppNavigator.js';
import myFavouritesNavigator from './myShowsNavigator.js';
//import loginContainer from './loginNav.js';
//import myFavouritesContainer from './myShowsNavigator.js';
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

const myShowsContainer = createStackNavigator(
    {
        FavouritesScreen: FavouriteScreen,
        FavouriteShow: FavouriteShowScreen,
    },
    {
        initialRouteName: "FavouritesScreen"
    }

);

const TabNavigator = createMaterialTopTabNavigator({
    //Home: AppNavigator,
    Signup: MyRegistration,
    Login: MyLogin,

});

const LoggedInNavigator = createMaterialTopTabNavigator(
    {
        Home: AppNavigator,
        myShows: myShowsContainer,
    },
    {
        initialRouteName: "Home"
    }


);
//const TabContainer = createAppContainer(TabNavigator);



//const myFavouritesContainer = createAppContainer(myShowsContainer);

const loginStackNavigator = createSwitchNavigator(
    {
        Tab: TabNavigator,
        MyFavourites: LoggedInNavigator,
    },
    {
        initialRouteName: "Tab"
    }

);

export default createAppContainer(loginStackNavigator);
