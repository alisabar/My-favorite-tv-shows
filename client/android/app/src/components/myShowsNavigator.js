import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import FavouriteScreen from './Favourites.js';
import TVShowScreen from './TVShowScreen.js';


const myShowsContainer = createStackNavigator(
    {
        Favourites: FavouriteScreen,
        TVShow: TVShowScreen,
    },
    {
        initialRouteName: "My Shows"
    }

);

const myFavouritesContainer = createAppContainer(myShowsContainer);

export default myFavouritesContainer;