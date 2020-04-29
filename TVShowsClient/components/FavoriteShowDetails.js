import React, { Component } from 'react';
import { Platform, StyleSheet, Text, ActivityIndicator, Image, TextInput, View, ScrollView, TouchableHighlight, Button, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { URL } from './Config.js';
import * as actions from './ReduxStore/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import ConfirmModal from './ConfirmationModal'
import Icon from 'react-native-vector-icons/FontAwesome';

function mapStateToProps(initialState) {
  console.log('initial state FavouriteShowScreen: ', initialState);
  return {

    MyTVShows: initialState
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchActions: bindActionCreators(actions, dispatch)
  }
}
class FavoriteShowScreen extends React.Component {

  static navigationOptions = {
    title: 'Details',
  };

  constructor(props) {

    super(props);

    this.startChecking = this.startChecking.bind(this);
    this.handleChildClick = this.handleChildClick.bind(this);
    this.deleteShow = this.deleteShow.bind(this);
    this.getData = this.getData.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this)
    this.state = {
      modalVisible: false,
      checkIfToDelete: false,
      errorMsg: '',
      showId: '',
      userId: '',
      TVShowImageUrl: '',
      TVShowComponent: '',
      defaultImage: '',
      name: '',
      language: '',
      premiered: '',
      rating: '',
      genres: '',
      imageUrl: '',
      flag: "delete"
    }

  }
  componentDidMount() {
    const { navigation } = this.props;
    const item = navigation.getParam('currentItem', 'NO-ID');
    const imgUrl = navigation.getParam('ImageUrl', 'NO-ID');

    this.setState({
      defaultImage: <Image source={{ uri: imgUrl }} style={{ width: 150, height: 200, }} />,
      showId: item ? JSON.stringify(item.id) : '',
      name: item ? JSON.stringify(item.name) : '',
      language: item ? JSON.stringify(item.language) : '',
      premiered: item ? JSON.stringify(item.premiered) : '',
      rating: item ? JSON.stringify(item.rating) : '',
      genres: item ? JSON.stringify(item.genres) : '',
      imageUrl: imgUrl == null ? '' : JSON.stringify(imgUrl),
    }, () => this.getData())

  }

  setModalVisible = () => {
    this.setState({ modalVisible: true, flag: "delete" })
  }

  getData = () => {
    console.log("in get data. userId: ", this.props.MyTVShows.userId);
    if (this.props.MyTVShows.userId != null) {

      this.setState({
        userId: this.props.MyTVShows.userId
      })
    }
  }

  startChecking = () => {
    this.setState({ checkIfToDelete: true })
  }


  handleChildClick = (toDelete) => {

    console.log("In handleChildClick: ", toDelete)
    if (toDelete) {
      this.deleteShow();
    }
  }


  deleteShow = () => {

    const { navigate } = this.props.navigation;
    const { dispatchActions } = this.props;
    const showId = this.state.showId ? this.state.showId : '';


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
          if (responseJson.msg == 'Deleted') {

            dispatchActions.fetchShows(this.state.userId);
            ToastAndroid.showWithGravity(`The show ${this.state.name} was deleted`, ToastAndroid.SHORT, ToastAndroid.CENTER);
            navigate('Favorites');

          }
          else {
            console.log("Error while delete " + responseJson.msg);
            this.setState({
              errorMsg: responseJson.msg
            })
          }
        })
        .catch((error) => {
          console.error(error);
        });

    }
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.image}>
          {this.state.defaultImage ?
           this.state.defaultImage :
            false
          }
        </View>

        <View style={styles.row}>
          <View style={styles.heading}>
            <Text style={styles.headline}>name: </Text>
          </View>
          <View style={styles.info}>
            {this.state.name == 'null' ?
             false :
             <Text style={styles.text}>
                {this.state.name.split('"').join('')}
             </Text>}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.heading}>
            <Text style={styles.headline}>language: </Text>
          </View>
          <View style={styles.info}>
            {this.state.language == 'null' ?
             false : <Text style={styles.text}>
                {this.state.language.split('"').join('')}
             </Text>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.heading}>
            <Text style={styles.headline}>Genres: </Text>
          </View>
          <View style={styles.info}>
            {this.state.genres == 'null' ?
             false :
             <Text style={styles.text}>
                 {this.state.genres.substr(2, this.state.genres.length - 4).split('","').join(', ')}
             </Text>
             }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.heading}>
            <Text style={styles.headline}>premiered: </Text>
          </View>
          <View style={styles.info}>

            {this.state.premiered == 'null' ?
             false :
             <Text style={styles.text}>
                {this.state.premiered.substr(1, this.state.genres.length).split('T')[0]}
             </Text>
            }

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

        <View>
        </View>
        <ConfirmModal
            onClick={this.handleChildClick}
            message={this.state.name}
            visible={this.state.modalVisible}
        />
      </View>

    );


  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingTop: 10,
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
  },
  button: {

    fontSize: 15,
    color: 'white',
  },

  row: {
    paddingLeft:10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  image: {

    flex: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },

});
export default connect(mapStateToProps, mapDispatchToProps)(FavoriteShowScreen);
