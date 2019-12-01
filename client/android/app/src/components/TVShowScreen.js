import React, { Component } from 'react';
import { Platform, StyleSheet, Text, ActivityIndicator, Image, TextInput, View, ScrollView, TouchableHighlight, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class TVShowScreen extends React.Component {
  static navigationOptions = {
    title: 'Details',
  };

  constructor(props) {
    super(props);
    this.submitFavourite = this.submitFavourite.bind(this);
    this.getData = this.getData.bind(this);

    this.state = {
      userId: '',
      TVShowImageUrl: '',
      TVShowComponent: '',
      defaultImage: '',
      name: '',
      language: '',
      premiered: '',
      rating: '',
      genres: '',
      imageUrl: ''
    }
  }
  componentDidMount() {
    const { navigation } = this.props;
    const item = navigation.getParam('currentItem', 'NO-ID');
    const imgUrl = navigation.getParam('ImageUrl', 'NO-ID');

    this.setState({
      defaultImage: <Image source={{ uri: imgUrl }} style={{ width: 100, height: 100, }} />,
      name: item ? JSON.stringify(item.show.name) : '',
      language: item ? JSON.stringify(item.show.language) : '',
      premiered: item ? JSON.stringify(item.show.premiered) : '',
      rating: item ? JSON.stringify(item.show.rating.average) : '',
      genres: item ? JSON.stringify(item.show.genres) : '',
      imageUrl: imgUrl ? JSON.stringify(imgUrl) : '',
    }, () => this.getData())

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
  submitFavourite = () => {
    const { navigate } = this.props.navigation;
    console.log('submit favourite pressed');
    if (this.state.userId.length > 0) {
      fetch('http://192.168.1.7:5000/api/addFavouriteShow', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.state.userId ? this.state.userId : '',
          name: this.state.name ? this.state.name : '',
          language: this.state.language ? this.state.language : '',
          premiered: this.state.premiered ? this.state.premiered : '',
          rating: this.state.rating ? this.state.rating : '',
          genres: this.state.genres ? this.state.genres : '',
          imageUrl: this.state.imageUrl ? this.state.imageUrl : '',
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('responseJson after addFavouriteShow: ', responseJson);
          this.setState({
            msg: responseJson.msg
          }, () => { navigate('Home'); });
        })
        .catch((error) => {
          console.error(error);
        });

    }
  }

  render() {


    return (
      <View style={{ flex: 1, justifyContent: "space-around", padding: 10 }}>

        <View style={styles.image}>
          {this.state.defaultImage ? this.state.defaultImage : false}
        </View>

        <View style={styles.row}>
          <View style={styles.heading}>
            <Text style={styles.headline}>name: </Text>
          </View>
          <View style={styles.info}>
            {this.state.name == 'null' ? false : <Text style={styles.text}>{this.state.name}</Text>}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.heading}>
            <Text style={styles.headline}>language: </Text>
          </View>
          <View style={styles.info}>
            {this.state.language == 'null' ? false : <Text style={styles.text}>{this.state.language}</Text>}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.heading}>
            <Text style={styles.headline}>premiered: </Text>
          </View>
          <View style={styles.info}>
            {this.state.premiered == 'null' ? false : <Text style={styles.text}>{this.state.premiered}</Text>}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.heading}>
            <Text style={styles.headline}>rating: </Text>
          </View>
          <View style={styles.info}>
            {this.state.rating == 'null' ? false : <Text style={styles.text}>{this.state.rating}</Text>}
          </View>
        </View>
        <TouchableHighlight onPress={this.submitFavourite} style={styles.touchable}>
          <Text style={styles.button}>
            LIKE
          </Text>
        </TouchableHighlight>
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
  headline: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
  scroll: {
    flex: 1,
  },
  heading: {
    flex: 1,

    //    marginLeft: 15,
    //    color: '#000080',
    //    fontSize: 20,
    //    fontWeight: 'bold',
    //    marginBottom: 20,

  },
  button: {

    fontSize: 15,
    color: 'white',
  },
  touchable: {


    padding: 10,
    height: 30,
    width: 50,
    backgroundColor: '#000080',
    //textAlign: 'center',
    borderRadius: 30,
    alignSelf: 'center',

  },
  row: {
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'space-around',
    alignItems: 'flex-start',


  },
  image: {
    //alignSelf:'center',
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',


  },
  info: {
    flex: 1,
  },

});