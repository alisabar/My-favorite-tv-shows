import React, { useState, useEffect ,useReducer } from 'react';
import { Platform,
StyleSheet, Text, ActivityIndicator, Image, TextInput, View, ScrollView, TouchableHighlight, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FavouriteShowScreen from './FavouriteShowScreen.js';
import TVShowComponent from './TVshow.js'
import {URL} from'./Config.js';
import * as actions from './ReduxStore/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from "react-redux"
import {rootReducer , initialState} from './ReduxStore/reducers'

function MyFavouriteShows(props) {

   const [shows, setShows] = useState('');
   const [myFavoriteSh, dispatch] = useReducer(rootReducer, initialState);

   useEffect(() => {
        let mounted = true;
        if(mounted){
            MyFavouriteShows.navigationOptions = () => {(
                title: ('My Shows')
            )}

          if(myFavoriteSh.favoriteShows){
                //createListComponents()
            }
        }
        return () => mounted = false;
    }, [myFavoriteSh.favoriteShows])

    const handleOpenWeather = () => {
        setShows(true);
    }
    const createListComponents = () => {
        //let showsData = this.state.favouriteShows ? this.state.favouriteShows : false;
        const showsData = useSelector(state => state.favoriteShows);

        console.log("createListComponents favourites:");
        console.log(showsData);
        let button = [];

        if (showsData) {
            button = <ScrollView style={styles.scroll}>
                {
                    showsData.map((item, index) => (
                        <TouchableHighlight key={index} onPress={() => this.props.navigation.navigate('FavouriteShow', {
                            currentItem: item,
                            ImageUrl: item.imageUrl == null ? '': item.imageUrl,
                        })}
                            underlayColor='#ddd'>

                            <TVShowComponent language={item.language} genres={item.genres} name={item.name ? item.name : '' } />
                        </TouchableHighlight>
                    ))
                }
            </ScrollView>
        }
        else {
            button = <Text style={styles.text}>hi</Text>;
        }
        setShows(button);

    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 5, flexDirection: 'column' }}>

                {shows ?
                            shows : <ActivityIndicator size="large" color="#0000ff" />}

            </View>
        </View>
        );

}


const styles = StyleSheet.create({

    container: {
        paddingTop: 10,
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    text: {
        color: 'black'
    },
    scroll: {
        flex: 1,
    },
    heading: {
        marginLeft: 15,
        color: '#000080',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,

    },

});

export default MyFavouriteShows;