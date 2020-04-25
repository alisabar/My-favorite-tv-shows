import React, { Component } from 'react';
import { Platform, StyleSheet, Text, ActivityIndicator, Image, TextInput, View, ScrollView, TouchableHighlight, Button } from 'react-native';
import SearchComponent from './Search.js';
import TVShowComponent from './TVshow.js';
import { URL } from './Config.js';

export default class HomeScreen extends Component {

  static navigationOptions = {
    title: 'Home',
  };

  constructor(props) {
    super(props);

    this.searchFor = this.searchFor.bind(this);
    this.searchAgain = this.searchAgain.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchSearchData = this.fetchSearchData.bind(this);
    this.state = {
      userId: '',
      tvShowsData: '',
      shows: [],
      searchUrl: 'http://api.tvmaze.com/search/shows?q=',
      searchKeyWords: 'star trek'
    }
  }

  componentDidMount = () => {
    this.fetchData();
    console.log("in component did home");
  }

  fetchData = () => {
    fetch(URL.concat('/api/shows'), {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson: ', responseJson);
        this.setState({
          tvShowsData: JSON.parse(responseJson)
        }, () => this.createComponents());
      })
      .catch((error) => {
        console.error(error);

      });
  }
  fetchSearchData = () => {
    const searchFor = this.state.searchKeyWords ? this.state.searchKeyWords : '';
    if (searchFor.length > 0) {
      fetch(URL.concat('/api/shows'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchWord: searchFor,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('responseJson: ', responseJson);
          this.setState({
            tvShowsData: JSON.parse(responseJson)
          }, () => this.createComponents());
        })
        .catch((error) => {
          console.error(error);
        });
    }

  }

  createComponents = () => {
    console.log('tvShowsData', JSON.stringify(this.state.tvShowsData));
    let showsData = this.state.tvShowsData ? this.state.tvShowsData : false;
    let list = [];
    if (showsData) {
      list = <ScrollView style={styles.scroll}>
        {
          showsData.map((item, index) => (
            <TouchableHighlight style={styles.listItem} key={index} onPress={() => this.props.navigation.navigate('TVShowScreen', { currentItem: item, ImageUrl: item.show.image == null ? '' : item.show.image.medium })} underlayColor='#ddd'>
              <TVShowComponent language={item.show.language} genres={item.show.genres} name={item.show.name} />
            </TouchableHighlight>
          ))
        }
      </ScrollView>

    } else {
      list = <Text style={styles.text}>hi</Text>;
    }
    this.setState({ shows: list });

  }
  searchFor = () => {
    const init = this.state.searchUrl.length > 0 ? this.state.searchUrl : '';
    const end = this.state.searchKeyWords ? this.state.searchKeyWords : '';
    let wordsToSearch;
    if (init.length > 0 && end.length > 0) {
      wordsToSearch = end.split(" ");
    }
    if (wordsToSearch.length == 1) {
      const theWholeFraze = init.concat(end);
      console.log(theWholeFraze);
      return theWholeFraze;
    }
    return;
  }
  searchAgain = () => {
    this.fetchSearchData();
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchComponent
          onSubmit={o => {
            this.setState({ searchKeyWords: o.searchUrl }, () => { this.searchAgain() });
          }}
        />
        <View style={{flexDirection: 'row' }}>
            <Text style={styles.heading} >
              TV Shows By:
            </Text>
            <Text style={styles.heading} >
               {this.state.searchKeyWords}
            </Text>
        </View>
        <View style={{ flex: 6, flexDirection: 'column' }}>
          {this.state.shows ?
            this.state.shows : <ActivityIndicator size="large" color="#0000ff" />}
        </View>
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


  },
  listItem:{
    borderBottomWidth:1,
    borderColor: '#eee',
  },
  heading: {
    marginLeft: 15,
    color: '#000080',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,

  },

});