import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableHighlight } from 'react-native'

export default class SearchComponent extends Component {

   constructor(props) {
      super(props);

      this.submitSearchUrl = this.props.onSubmit;

      state = {
         searchUrl: ''
      }
   }
   submitSearch = () => {
      if (this.submitSearchUrl) {
         this.submitSearchUrl({
            searchUrl: this.state.searchUrl,
         });
      }
   }
   render() {
      return (
         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
               style={styles.inputText}
               placeholder="Enter search"
               onChangeText={(text) => this.setState({ searchUrl: text })}
            />
            <TouchableHighlight onPress={this.submitSearch} style={styles.touchable}>
               <Text style={styles.button}>
                  GO
                 </Text>
            </TouchableHighlight>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   inputText: {
      margin: 15,
      backgroundColor: '#E6E6FA',
      height: 50,
      borderColor: '#000080',
      borderRadius: 25,
      borderWidth: 1,
      width: 200,
      paddingLeft: 15,
      paddingRight: 15,
      flex: 0.8,

   },
   button: {
      marginTop: 15,
      backgroundColor: '#000080',
      padding: 10,
      height: 50,
      width: 50,
      fontSize: 20,
      textAlign: 'center',
      borderRadius: 30,
      color: 'white',
   },
   touchable: {

      flex: 0.2,
   }

})
