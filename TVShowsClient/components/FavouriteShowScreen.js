import React, { Component } from 'react';
import { Platform, StyleSheet, Text, ActivityIndicator, Image, TextInput, View, ScrollView, TouchableHighlight, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {URL} from'./Config.js';
import * as actions from './ReduxStore/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';


function mapStateToProps(initialState) {
    console.log('initial state : ', initialState);
    return {

        MyTVShows: initialState
    }
}
function mapDispatchToProps(dispatch) {
    return {
        dispatchActions: bindActionCreators(actions, dispatch)
    }
}
class FavouriteShowScreen extends React.Component {

  static navigationOptions = {
    title: 'Details',
  };

  constructor(props) {

    super(props);
    this.deleteShow = this.deleteShow.bind(this);
    this.getData = this.getData.bind(this);

//    this.state = {
//      showId:'',
//      userId: '',
//      TVShowImageUrl: '',
//      TVShowComponent: '',
//      defaultImage: '',
//      name: '',
//      language: '',
//      premiered: '',
//      rating: '',
//      genres: '',
//      imageUrl:''
//    }

  }
  componentDidMount() {
    const { navigation } = this.props;
    const item = navigation.getParam('currentItem', 'NO-ID');
    const imgUrl = navigation.getParam('ImageUrl', 'NO-ID');

    this.setState({
      defaultImage: <Image source={{ uri: imgUrl }} style={{ width: 100, height: 100, }} />,
      showId: item ? JSON.stringify(item.id)  : '',
      name: item ? JSON.stringify(item.name)  : '',
      language: item ? JSON.stringify(item.language) :  '',
      premiered: item ? JSON.stringify(item.premiered) :  '',
      rating: item ? JSON.stringify(item.rating) : '',
      genres: item ? JSON.stringify(item.genres) : '',
      imageUrl: imgUrl==null ?'': JSON.stringify(imgUrl),
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
  deleteShow = () => {

      const { navigate } = this.props.navigation;
      const { dispatchActions } = this.props;
      const showId = this.state.showId ? this.state.showId : '';
      dispatchActions.deleteFavorite(showId);

    console.log('submit deleteFavouriteShow pressed');
    if (this.state.userId.length > 0) {
      fetch(URL.concat('/api/deleteFavouriteShow'), {
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
          console.log('responseJson after deleteFavouriteShow: ', responseJson);
          this.setState({
            msg: responseJson.msg
          },()=>{navigate('FavouritesScreen');});
        })
        .catch((error) => {
          console.error(error);
        });

    }
  }

  render() {


    return (
    <View style={{ flex: 1, justifyContent: "space-around", padding:10}}>

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
        <TouchableHighlight onPress={this.deleteShow} style={styles.touchable}>
          <Text style={styles.button}>
            Delete
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
  headline:{
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
    flex:1,
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
    borderRadius: 30,
    alignSelf:'center',
  },
  row:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image:{
     flex:3,
     flexDirection: 'row',
     justifyContent: 'center',
  },
  info:{
    flex: 1,
  },

});
export default connect(mapStateToProps, mapDispatchToProps)(FavouriteShowScreen);
