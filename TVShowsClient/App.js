/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, StyleSheet,Text} from 'react-native';
import LoginStackNavigator from './components/Tabs';


function App() {
console.log('in app.js');
  return (
    <View className="App" >
    <Text numberOfLines={5}>
              HIIIIIII
            </Text>
         <LoginStackNavigator/>
    </View>
  );
};



export default App;
