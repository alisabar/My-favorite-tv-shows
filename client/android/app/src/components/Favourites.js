import React from 'react';
import { Platform, StyleSheet, Text, ActivityIndicator, Image, TextInput, View, ScrollView, TouchableHighlight, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// {this.state.shows? this.state.shows : <ActivityIndicator size="large" color="#0000ff" />}
export default class MyFavouriteShows extends React.Component {

    static navigationOptions = {
        title: 'My Shows',
    };

    constructor(props) {
        super(props);
        // this.SubmitForm = this.SubmitForm.bind(this);
        this.retrieveItem = this.retrieveItem.bind(this);
        this.state = { favouriteShows: '', msg: 'lalala', shows: '' };
    }

    componentDidMount() {
        console.log("in favourites componentDidMount");
        this.retrieveItem().then((userId) => {

            console.log("user id extracted: "+userId);
            if (userId !== null) {
                fetch('http://192.168.1.10:5000/api/getMyFavouriteShows', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId
                    }),
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log('responseJson favourites: ', responseJson);
                        this.setState({
                            favouriteShows: JSON.parse(responseJson),
                        });
                    }, () => this.createListComponents())
                    .catch((error) => {
                        console.error(error);
                    });
            }

        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });

    }

    retrieveItem = async () => {
        try {
          const retrievedItem =  await AsyncStorage.getItem('userId');
          //const item = JSON.parse(retrievedItem);
          return retrievedItem;
        } catch (error) {
          console.log(error.message);
        }
        return
      }

        getData = async () => {
          try {
            const value = await AsyncStorage.getItem('userId')
            if (value !== null) {
              this.setState({
                userId: value
              })
            }
          } catch (e) {
            console.log(e);
          }
        }

    createListComponents = () => {
        let showsData = this.state.favouriteShows ? this.state.favouriteShows : false;
        let button = [];

        if (showsData) {
            button = <ScrollView style={styles.scroll}>
                {
                    showsData.map((item, index) => (
                        <TouchableHighlight key={index} onPress={() => this.props.navigation.navigate('TVShow', {
                            currentItem: item,
                            ImageUrl: item.show.image.medium
                        })}
                            underlayColor='#ddd'>

                            <TVShowComponent language={item.show.language} genres={item.show.genres} name={item.show.name} />
                        </TouchableHighlight>
                    ))
                }
            </ScrollView>
        }
        else {
            button = <Text style={styles.text}>hi</Text>;
        }
        this.setState({ shows: button });
    }
    render() {

        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>hgjhg</Text>


            </View>

        );
    }
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