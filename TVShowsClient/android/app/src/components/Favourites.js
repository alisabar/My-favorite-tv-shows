import React from 'react';
import { Platform,
StyleSheet, Text, ActivityIndicator, Image, TextInput, View, ScrollView, TouchableHighlight, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FavouriteShowScreen from './FavouriteShowScreen.js';
import TVShowComponent from './TVshow.js';
import {URL} from'./Config.js';
import * as actions from './ReduxStore/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from "react-redux";


function MyFavouriteShows(props) {

   const [shows, setShows] = useState('');
//    constructor(props) {
//        super(props);
//        this.getUserId = this.getUserId.bind(this);
//        this.state = { favouriteShows: '', msg: 'lalala', shows: '' };
//    }
   useEffect(() => {
        const showsData = useSelector(state => state.favoriteShows);

        if(showsData){this.createListComponents(showsData);}

    }, [showsData])
//    const handleOpenWeather = () => {
//        setShows(true);
//    }
//    componentDidMount() {
//        console.log("in favourites componentDidMount");
//        this.getUserId().then((userId) => {
//
//            console.log("user id extracted: "+userId);
//            if (userId !== null) {
//                fetch(URL.concat('/api/getMyFavouriteShows'), {
//                    method: 'POST',
//                    headers: {
//                        Accept: 'application/json',
//                        'Content-Type': 'application/json',
//                    },
//                    body: JSON.stringify({
//                        userId: userId
//                    }),
//                })
//                    .then((response) => response.json())
//                    .then((responseJson) => {
//                        console.log('responseJson favourites: ', responseJson);
//                        this.setState({
//                            favouriteShows: JSON.parse(responseJson),
//                        },() => this.createListComponents());
//                    })
//                    .catch((error) => {
//                        console.error(error);
//                    });
//            }
//
//        }).catch((error) => {
//            console.log('Promise is rejected with error: ' + error);
//        });
//
//    }
//
//    getUserId = async () => {
//        try {
//          const retrievedItem =  await AsyncStorage.getItem('userId');
//
//          return retrievedItem;
//        } catch (error) {
//          console.log(error.message);
//        }
//        return
//      }

    createListComponents = (showsData) => {
        //let showsData = this.state.favouriteShows ? this.state.favouriteShows : false;
        //const showsData = useSelector(state => state.favoriteShows);

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
MyFavouriteShows.navigationOptions = () => {(
    title: 'My Shows'
)}
export default MyFavouriteShows;
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

